import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { Dosificacion } from 'src/app/shared/interfaces/dosificacion.interface';
import { Dieta } from 'src/app/shared/interfaces/dieta.interface';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { PorcentajeKg } from 'src/app/shared/interfaces/porcentaje-kg.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-dosificacion',
  templateUrl: './dosificacion.component.html',
  styleUrls: ['./dosificacion.component.css']
})
export class DosificacionComponent implements OnInit{

  public actualizar: boolean = false;
  public dietas: Dieta[] = [];
  public lotes: Lote[] = [];
  public dieta!: Dieta;
  public nlotes: string[] = [];
  public ndietas: string[] = [];
  public porcentajesKg: number[] = [];
  public productos: string[] = [];
  public usuarioId!: string;
  public posicion: number = 0;
  public porcentaje: number = 0;
  public porcentajeFaltante: number = 0;
  public nombreDieta: string = 'Nombre de la dieta';
  public loteId!: string;
  public dietaId!: string;
  public pesoTotal: number = 0;
  public costoTotal: number = 0;
  public pesoVivoKg: number = 0;
  public porcentajeContenidoKg: PorcentajeKg [] = [];
  public precios: number[] = [];
  public showSnackbar: boolean = false;
  public mensaje: string = '';


  formDosis: FormGroup = this.fb.group({
    dieta: ['', Validators.required],
    porcentajePeso: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFinal: ['', Validators.required],
    costoDosificacion: [''],
    loteId: ['']
  });

  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required]
  });


  constructor(  private userService: UserService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    this.userService.getLoteByUsuarioId(this.usuarioId, 0, 0)
    .subscribe( lotes => {
      this.lotes = lotes;
      this.nlotes = lotes.map((lote) => {
        return lote.nombreLote;
      });
    });

    this.userService.getDietasByUsuarioId(this.usuarioId, 0, 0)
    .subscribe( dietas => {
      this.dietas = dietas;
      this.ndietas = dietas.map( dieta => {
        return dieta.nombreDieta;
      });
    });


    this.formNombreLote.get('nombreLote')?.valueChanges
    .subscribe(nombreLote => {
      this.costoTotal = 0;
      this.seleccionLote(this.usuarioId, nombreLote);
    });

    this.formDosis.get('dieta')?.valueChanges
    .subscribe( nombreDieta => {
      this.costoTotal = 0;
      this.seleccionDieta(this.usuarioId, nombreDieta);
    })



  }

  campoNoValido(campo: string) {
    return this.formDosis.get(campo)?.invalid
      && this.formDosis.get(campo)?.touched;
  }

  public campoTouched(campo: string){
    return this.formDosis.get(campo)?.touched;
  }


  seleccionLote(id: string, nombreLote: string) {
    const LOTESELECT = { id, nombreLote };

    this.userService.getLoteByUsuarioIdAndNombreLote(LOTESELECT)
      .subscribe(async lote => {
        this.loteId = lote.id!;
        this.getVacas(this.loteId);
      },
      error=>{

      });
  }

  getVacas(loteId: string){
    this.userService.getVacasByLoteId(loteId,0,0)
    .subscribe(async vacas => {
      const PESOS = [];

      for (let i = 0; i < vacas!.length; i++) {
        const PESO = await this.getPeso(vacas![i].id!)
        PESOS.push(PESO);
      }

      let pesoTotal = 0;
      PESOS.forEach(peso => {
        pesoTotal = pesoTotal + peso.kg!;
      })
      console.log(pesoTotal);

      this.pesoTotal = pesoTotal;
    })
  }


  seleccionDieta(id: string, nombreDieta: string) {
    const DIETASELECT = { id, nombreDieta };

    this.userService.getDietaByUsuarioIdAndName(DIETASELECT)
      .subscribe(dieta => {
        this.dietaId = dieta.id!;
        this.dieta = dieta;
        console.log(dieta);
      },
      error=> {
        this.pesoTotal = 0;
        this.dieta = undefined!;
        this.porcentaje = 0;
        this.pesoVivoKg = 0;
        this.porcentajeContenidoKg = [];
      });
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
        });
    });
  }

  public calcular(){
    this.porcentajeContenidoKg = [];
    this.pesoVivoKg = this.pesoTotal * (this.formDosis.get('porcentajePeso')?.value/100);
    let COSTO = 0;

     this.dieta.contenidoDieta!.forEach(contenido => {
      let PORCENTAJES: PorcentajeKg = {
        porcentaje: this.pesoVivoKg *(contenido.porcentaje/100),
        precio: contenido.precio!
      }
        this.porcentajeContenidoKg.push( PORCENTAJES )
        COSTO += (this.pesoVivoKg *(contenido.porcentaje/100)) * contenido.precio!;
        this.costoTotal = COSTO;
      });

     this.porcentaje = this.formDosis.get('porcentajePeso')?.value;
  }


  registerDosis(){
      const FECHAINICIO = moment(this.formDosis.get('fechaInicio')?.value,'YYYY-MM-DD').format('DD/MM/YYYY');
      const FECHAFINAL = moment(this.formDosis.get('fechaFinal')?.value,'YYYY-MM-DD').format('DD/MM/YYYY');
      const DOSIS: Dosificacion  = {
        dieta: this.formDosis.get('dieta')?.value,
        fechaInicio: FECHAINICIO,
        fechaFinal: FECHAFINAL,
        pesoVivoKg: this.pesoVivoKg,
        costoDosificacion: this.costoTotal,
        loteId: this.loteId
      }

      this.userService.createDosis(DOSIS)
      .subscribe( dosis => {
        console.log(dosis,'creada');
        this.mensaje = 'Dosificación Registrada'
        this.toggleSnackbar();
      })

  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;


    if (this.showSnackbar) {
      setTimeout(() => {
        this.formDosis.reset({
          dieta:'',
          pesoPorcentaje:'',
          fechaInicio: '',
          fechaFinal:'',
        });
        this.formNombreLote.reset({
          nombreLote:''
        });

        location.reload();
      }, 2000);
    }
  }


}
