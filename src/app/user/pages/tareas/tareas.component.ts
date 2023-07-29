import { Component, OnInit } from '@angular/core';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { UserService } from '../../user.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { Dosificacion } from 'src/app/shared/interfaces/dosificacion.interface';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  public usuarioId!: string;
  public lotes!: Lote [];
  public lote!: Lote;
  public lotesNombre!: string[];
  public fechaActual: string = moment().format('DD/MM/YYYY');
  public alimentacion: boolean = false;
  public pesos: boolean = true;
  public problemas: boolean = false;
  public pesoTotal: number = 0;
  public dosis: Dosificacion[] = [];
  public vacas: Vaca[] =[];
  public showSnackbar: boolean = false;
  public mensaje: string = '';

    /* formulario para hacer la peticion */
    formNombreLote: FormGroup = this.fb.group({
      nombreLote: ['', Validators.required]
    });

  constructor( private userService: UserService,
               private fb: FormBuilder,
               private router: Router ){}

  ngOnInit(): void {

     this.usuarioId = this.userService.decodeUsuarioFromToken()!;

     this.userService.getLoteByUsuarioId(this.usuarioId, 0, 0)
       .subscribe(lotes => {
           this.lotes = lotes;
           console.log(this.lotes);
           this.lotesNombre = lotes.map( lote => {
            return lote.nombreLote;
           });

       });

    this.formNombreLote.get('nombreLote')?.valueChanges
    .subscribe(nombreLote => {
      this.seleccionLote(this.usuarioId, nombreLote);
    });
  }


    seleccionLote(id: string, nombreLote: string) {
      const LOTESELECT = { id, nombreLote };
      console.log('entro al loteselect', LOTESELECT);
      this.userService.getLoteByUsuarioIdAndNombreLote(LOTESELECT)
        .subscribe( lote => {
          console.log(lote);
           this.lote = lote;
           this.dosis = [];
           this.getDosis(lote.id!);
           this.vacas = [];
           this.getVacas(lote.id!);
        },
        error => {
          this.lote = undefined!;
          console.log('error');
        })
    }

    public getDosis(loteId: string){
      console.log('entro a la dosis', loteId);
      this.userService.getDosisByLoteId(loteId,0,0)
      .subscribe(dosis => {
        this.dosis = dosis;
      })

    }

    public async getPeso(vacaId: string): Promise<Peso> {
      return new Promise((resolve, reject) => {
        this.userService.getPesoByVacaId(vacaId)
          .subscribe({
            next: peso => {
              peso = peso.sort((a, b) => (a.dia! > b.dia!) ? 1 : -1);
              const LASTPESO = peso[peso.length - 1];
              resolve(LASTPESO);
            },
            error: () => { reject([]) }
          })
      })
    }

    public getVacas(loteId: string){
      this.userService.getVacasByLoteId(loteId,0,0)
      .subscribe( vacas => {
        this.vacas = vacas;
      })
    }


  public alimentacionBtn(){
    this.alimentacion = true;
    this.pesos= false;
    this.problemas = false;
  }

  public pesosBtn(){
    this.pesos= true;
    this.alimentacion = false;
    this.problemas = false;
  }

  public problemasBtn(){
    this.problemas = true;
    this.alimentacion = false;
    this.pesos= false;
  }


  public actualizar(vacaId: string) {
    this.router.navigate([`./user/${this.usuarioId}/actualizar-peso/${vacaId}`]);
  }

  public toFormulacion(){
    this.router.navigate([`./user/${this.usuarioId}/formulacion`]);
  }


  public deleteDosis(vacaId: string){
    this.userService.deleteDosis(vacaId)
    .subscribe( dosis => {
      console.log(dosis,'eliminado');
      this.mensaje = 'Dosificación eliminada';
      this.toggleSnackbar();
    })
  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;
    if (this.showSnackbar) {
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }

}
