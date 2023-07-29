import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { NombreLote_UsuarioId } from 'src/app/shared/interfaces/nombrelote-usuarioid.interface';
import { UserService } from '../../user.service';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { Alimento } from 'src/app/shared/interfaces/alimento.interface';
import { Alimentacion } from 'src/app/shared/interfaces/alimentacion.interface';
import * as moment from 'moment'
moment.locale('es'); /* Declaraciones del moment js */

@Component({
  selector: 'app-alimentacion',
  templateUrl: './alimentacion.component.html',
  styleUrls: ['./alimentacion.component.css']
})

export class AlimentacionComponent implements OnInit {
  public usuarioId!: string;
  public lote!: Lote;
  public lotes!: string[];
  public loteSelect!: NombreLote_UsuarioId;
  public loteId!: string;
  public alimentos!: string[];
  public alimentoId!: string;
  public alimento!: Alimento;
  public pesos!: Peso[];
  public pesoActual!: Peso;
  public fechaPesoActual!: string;
  public fechaActual: string = moment().format('DD/MM/YYYY')
  public pesoTotal!: number;
  public pesoAlimentacion!: number;
  public costoAlimentacionD!: number;
  public costoAlimentacionT!: number;
  public fechaInicio!: string;
  public fechaFinal!: string;
  public diferenciaDias!: number;
  public calculado: boolean = false;
  public actualizar: boolean = false;
  public inputTouched: string = '';
  public campo!: string;
  /*Outputs para mandarle al snackbar */
  @Output() public showSnackbar: boolean = false;
  @Output() public mensaje: string = 'Alimentación agregada'

  /* formulario para hacer la peticion */
  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required]
  });

  /* formulario para hacer peticion del alimento */
  formNombreAlimento: FormGroup = this.fb.group({
    nombreAlimento: ['', Validators.required]
  });


  /* formulario para hacer peticion del alimento */
  formAlimentacion: FormGroup = this.fb.group({
    factor: ['', Validators.required],
    nombreAlimento: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFinal: ['', Validators.required]
  });

  constructor(  private userService: UserService,
                private fb: FormBuilder) {}



  ngOnInit(): void {
    /* Variable que contiene el ID del usuario */
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    /*Llamamos el metodo para el Get de los lotes */
    this.userService.getLoteByUsuarioId(this.usuarioId, 0, 0)
      /*mapeo de los nombres de los lotes */
      .subscribe(lotes => {
        /* lotes contendra los nombres */
        this.lotes = lotes.map(lote => {
          return lote.nombreLote;
        });
      });

    /* Get para los nombres de los alimentos */
    this.userService.getAlimentoByUsuarioId(this.usuarioId, 0, 0)
      /* Mapeo de los nombres de los alimentos */
      .subscribe(alimentos => {
        this.alimentos = alimentos.map(alimento => {
          return alimento.nombreAlimento;
        });
      });

    /*Se evalua cuando cambia el contenido del selector*/
    this.formNombreLote.get('nombreLote')?.valueChanges
      .subscribe(nombreLote => {
        this.calculado = false;
        /*Mandamos llamar seleccion lote para hacer la peticion del lorte */
        /*le mandamos la variable que contiene el id 
          y el valor que tiene el selector */
        this.seleccionLote(this.usuarioId, nombreLote);
      });

    this.formAlimentacion.get('nombreAlimento')?.valueChanges
      .subscribe(nombreAlimento => {
        this.seleccionAlimento(this.usuarioId, nombreAlimento);
      })

  }


  seleccionAlimento(id: string, nombreAlimento: string) {

    const ALIMENTOSELECT = { id, nombreAlimento }

    this.userService.getAlimentoByUsuarioIdAndNombreAlimento(ALIMENTOSELECT)
      .subscribe(alimento => {
        console.log(alimento, 'alimentoseleccionado');
        this.alimentoId = alimento.id!;
        this.alimento = alimento;
      });
  }



  /*Metodo para seleccionar lote con el selector */
  seleccionLote(id: string, nombreLote: string) {
    /* Variable con interfaz para hacer peticion de un get con el ID del usuario 
       y con el nombre del lote */
    this.loteSelect = { id, nombreLote };
    /*Llamada al metodo que hara la peticion */
    this.userService.getLoteByUsuarioIdAndNombreLote(this.loteSelect)
      .subscribe(async lote => {
        /* Le pasa el id del lote */
        this.loteId = lote.id!;
        /* */
        this.lote = lote;

        const PESOS = [];

        for (let i = 0; i < lote.vacas!.length; i++) {
          const PESO = await this.getPeso(lote.vacas![i].id!)
          PESOS.push(PESO);
        }
        console.log(PESOS, 'MEGUSTA ANDARPORLASIERRA ');

        let pesoTotal = 0;
        PESOS.forEach(peso => {
          pesoTotal = pesoTotal + peso.kg!;
        })
        console.log(pesoTotal);

        this.pesoTotal = pesoTotal;
      },
      error => {
        this.lote = undefined!;
      })
  }


  campoNoValido(campo: string) {
    return this.formAlimentacion.get(campo)?.invalid
      && this.formAlimentacion.get(campo)?.touched;
  }

  public campoTouched(campo: string){
    return this.formAlimentacion.get(campo)?.touched;
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

  /*Calcular alimentacion */
  public calcularAlimentacion() {
    /*Pasamos los datos que tiene el form */
    this.pesoAlimentacion = this.pesoTotal * (this.formAlimentacion.get('factor')?.value / 100);
    this.fechaInicio = moment(this.formAlimentacion.get('fechaInicio')?.value).format('DD/MM/YYYY');
    this.fechaFinal = moment(this.formAlimentacion.get('fechaFinal')?.value).format('DD/MM/YYYY');

    /*Conversiones de las fechas para que acepte el formato */
    const FI = moment(this.fechaInicio.substring(6, 11) + this.fechaInicio.substring(3, 5) + this.fechaInicio.substring(0, 2), 'YYYY/MM/DD');
    const FF = moment(this.fechaFinal.substring(6, 11) + this.fechaFinal.substring(3, 5) + this.fechaFinal.substring(0, 2), 'YYYY/MM/DD');
    
    this.costoAlimentacionD = this.pesoAlimentacion * this.alimento.precio;
    this.diferenciaDias = FF.diff(FI, 'day');
    this.costoAlimentacionT = this.costoAlimentacionD * this.diferenciaDias;

    this.calculado = true;
  }

  /*Registrar la alimentacion */
  public registrarAlimentacion() {
    let ALIMENTACION!: Alimentacion;

    ALIMENTACION = {
      fechaInicio: this.fechaInicio,
      fechaFinal: this.fechaFinal,
      kgAlimentacion: this.pesoAlimentacion,
      lbAlimentacion: this.pesoAlimentacion * 2,
      costoAlimentacionDia: this.costoAlimentacionD,
      costoAlimentacionTotal: this.costoAlimentacionT,
      pesoTotalLote: this.pesoTotal,
      loteId: this.loteId,
      alimentoId: this.alimentoId
    }

    this.userService.createAlimentacion(ALIMENTACION)
      .subscribe(alimentacion => {
        this.formAlimentacion.reset();
        this.formNombreAlimento.reset({
          nombreAlimento: ''
        });
        this.formNombreLote.reset({
          nombreLote: ''
        });
        this.toggleSnackbar();
      })

  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;

    if (this.showSnackbar) {
      setTimeout(() => {
        this.showSnackbar = false;
      }, 3000);
    }
  }

}
