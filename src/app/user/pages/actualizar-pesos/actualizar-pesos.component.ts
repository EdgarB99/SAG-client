import * as moment from 'moment';
import { UserService } from '../../user.service';
import { Component, OnInit } from '@angular/core';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { LoteArete } from 'src/app/shared/interfaces/lote-arete.interface';
import { NombreLote_UsuarioId } from 'src/app/shared/interfaces/nombrelote-usuarioid.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/* Declaraciones del moment js */
moment.locale('es');

@Component({
  selector: 'app-actualizar-pesos',
  templateUrl: './actualizar-pesos.component.html',
  styleUrls: ['./actualizar-pesos.component.css'],
})
export class ActualizarPesosComponent implements OnInit {
  public usuarioId!: string;
  public lotes!: string[];
  public lote!: Lote;
  public loteId!: string;
  public loteSelect!: NombreLote_UsuarioId;
  public areteSelect!: LoteArete;
  public vaca!: Vaca;
  public vacaId!: string;
  public aretes!: string[];
  public fecha: string = moment().format('Do MMMM YYYY');
  public fechaActual: string = moment().format('DD/MM/YYYY');
  public fechaPesoActual: string = '';
  public pesos!: Peso[];
  public pesoActual!: Peso;
  public pesoAnterior!: Peso;
  public isDisabled: boolean = true;

  /* formulario para hacer la peticion */
  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required],
  });

  /* formulario para hacer peticion del alimento */
  formVacaArete: FormGroup = this.fb.group({
    arete: ['', Validators.required],
  });

  /*formulario para actualizar pesos */
  formPeso: FormGroup = this.fb.group({
    dia: [''],
    kg: ['', Validators.required],
    lb: ['', Validators.required],
    vacaId: [''],
  });

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    this.userService
      .getLoteByUsuarioId(this.usuarioId, 0, 0)
      .subscribe((lotes) => {
        this.lotes = lotes.map((lote) => {
          return lote.nombreLote;
        });
      });

    /*Se evalua cuando cambia el contenido del selector*/
    this.formNombreLote
      .get('nombreLote')
      ?.valueChanges.subscribe((nombreLote) => {
        this.formVacaArete.reset({
          arete: '',
        });
        this.vaca = undefined!;
        this.pesoActual = undefined!;
        this.pesoAnterior = undefined!;
        this.fechaPesoActual = '';
        this.seleccionLote(this.usuarioId, nombreLote);
      });

    /*  */
    this.formVacaArete.get('arete')?.valueChanges.subscribe((arete) => {
      this.pesoActual = undefined!;
      this.pesoAnterior = undefined!;
      this.fechaPesoActual = '';
      this.formPeso.reset();
      this.seleccionArete(this.loteId, arete);
    });

    /* Conversion de kg a libras */
    this.formPeso.get('kg')?.valueChanges.subscribe((kg) => {
      this.formPeso.get('lb')?.setValue(kg * 2.204);
    });
  }

  /*Metodo para obtener a las vacas del lote */
  seleccionLote(id: string, nombreLote: string) {
    this.loteSelect = { id, nombreLote };
    this.userService
      .getLoteByUsuarioIdAndNombreLote(this.loteSelect)
      .subscribe((lote) => {
        this.loteId = lote.id!;
        this.lote = lote;
        this.getVacas(lote.id!);
      });
  }

  getVacas(loteId: string) {
    this.userService.getVacasByLoteId(loteId, 0, 0).subscribe((vacas) => {
      this.aretes = vacas.map((vaca) => {
        return vaca.arete;
      });
    });
  }

  /* Metodo para obtener datos de la vaca */

  seleccionArete(id: string, arete: string) {
    this.areteSelect = { id, arete };
    console.log(this.areteSelect);
    this.userService.getVacaByLoteIdAndArete(this.areteSelect).subscribe(
      (vaca) => {
        console.log('Vaca seleccionada', vaca);
        this.vaca = vaca;
        this.vacaId = vaca.id!;
        this.pesos = vaca.peso!;
        if (this.pesos.length !== 0) {
          this.getLastPeso();
          this.getPesoAnterior();
        }
      },
      (error) => {
        this.aretes = undefined!;
      }
    );
  }

  getLastPeso() {
    this.pesos = this.pesos.sort((a, b) => (a.dia! > b.dia! ? 1 : -1));
    this.pesoActual = this.pesos[this.pesos.length - 1];
    this.fechaPesoActual = this.pesoActual.dia!;
    console.log(
      'peso',
      this.pesoActual,
      'day',
      this.fechaPesoActual,
      'day2',
      this.fechaActual
    );
  }

  getPesoAnterior() {
    this.pesos = this.pesos.sort((a, b) => (a.dia! > b.dia! ? 1 : -1));
    this.pesoAnterior = this.pesos[this.pesos.length - 2];
    console.log('peso', this.pesoAnterior);
  }

  campoNoValido(campo: string) {
    return (
      this.formPeso.get(campo)?.invalid && this.formPeso.get(campo)?.touched
    );
  }

  registerPeso() {
    this.formPeso.get('dia')?.setValue(this.fechaActual);
    this.formPeso.get('vacaId')?.setValue(this.vacaId);
    this.userService.createPeso(this.formPeso.value).subscribe((peso) => {
      this.pesoAnterior = this.pesoActual;
      this.pesoActual = peso;
      this.fechaPesoActual = peso.dia!;
      this.formPeso.reset();
    });
  }
}
