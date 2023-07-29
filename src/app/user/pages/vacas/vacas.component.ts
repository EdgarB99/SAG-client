import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NombreLote_UsuarioId } from '../../../shared/interfaces/nombrelote-usuarioid.interface';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacas',
  templateUrl: './vacas.component.html',
  styleUrls: ['./vacas.component.css'],
})
export class VacasComponent implements OnInit {
  public usuarioId!: string;
  public vacas!: Vaca[];
  public vaca!: Vaca;
  public lotes!: string[];
  public loteSelect!: NombreLote_UsuarioId;
  public loteId!: string;
  public modal: boolean = false;
  public actualizar: boolean = false;
  public titulo: string = 'Registrar Vaca';
  public pagination: number = 0;
  public pesos!: Peso[][];
  public razas: string[] = [
    'Charolais',
    'Beefmaster',
    'Simmental',
    'Angus',
    'Brangus',
    'Santa Gertrudis',
    'Hereford',
    'Limousin',
    'Cebú Brahman',
    'Belgian Blue'
  ];

  /* formulario para hacer la peticion */
  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required],
  });

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private router:Router) {}

  ngOnInit(): void {
    /* Variable que contiene el ID del usuario */
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    /*Llamamos el metodo para el Get de los lotes */
    this.userService
      .getLoteByUsuarioId(this.usuarioId, 0, 0)
      /*mapeo de los nombres de los lotes */
      .subscribe((lotes) => {
        /* lotes contendra los nombres */
        this.lotes = lotes.map((lote) => {
          return lote.nombreLote;
        });
      });

    /*Se evalua cuando cambia el contenido del selector*/
    this.formNombreLote
      .get('nombreLote')
      ?.valueChanges.subscribe((nombreLote) => {
        /*Mandamos llamar seleccion lote para hacer la peticion del lorte */
        /*le mandamos la variable que contiene el id
          y el valor que tiene el selector */
        this.seleccionLote(this.usuarioId, nombreLote);
      });
  }

  /*Metodo para seleccionar lote con el selector */
  seleccionLote(id: string, nombreLote: string) {
    /* Variable con interfaz para hacer peticion de un get con el ID del usuario
       y con el nombre del lote */
    this.loteSelect = { id, nombreLote };
    /*Llamada al metodo que hara la peticion */
    this.userService
      .getLoteByUsuarioIdAndNombreLote(this.loteSelect)
      .subscribe((lote) => {
        /* Le pasa el id del lote */
        this.loteId = lote.id!;
        /* */
        this.pagination = 0;
        /* Llamamos el metodo para obtener las vacas */
        this.getVacas(this.loteId);
      });
  }

  /* Metodo para poder agregar una vaca */
  agregarVaca() {
    /* la bandera actualizar pasa a false */
    this.actualizar = false;
    /* El titulo cambia a agregar vaca */
    this.titulo = 'Agregar Vaca';
    /* Se abre la ventana modal */
    if (this.modal) {
      this.modal = false;
    } else {
      this.modal = true;
    }
  }

  /* Metodo para el boton editar */
  editarVaca(vacaId: any) {
    console.log(vacaId);
    /* La bandera de actualizar pasa a true */
    this.actualizar = true;
    /* El titulo cambia a editar */
    this.titulo = 'Editar Vaca';

    /* Llamamos el metodo para conseguir los datos*/
    this.userService.getVacaById(vacaId).subscribe((vaca) => {
      this.vaca = vaca;
      /* Cambia el modal al completarse la busqueda */
      if (this.modal) {
        this.modal = false;
      } else {
        this.modal = true;
      }
    });
  }

  eliminarVaca(vacaId: string){
    const VACA = {
      eliminado:true
    }
    this.userService.updateVaca(vacaId, VACA)
    .subscribe( vaca => {
      console.log(vaca, 'Eliminada');
    })
  }

  /* Metodo para hacer get de las vacas */
  getVacas(loteId: string) {
    /*Hacemos peticion de 5 registros y el offset hara un salto de 5
     registros para poder obtener los siguientes 5 */
    this.userService
      .getVacasByLoteId(loteId, 5, this.pagination * 5)
      .subscribe((vacas) => {
        this.vacas = vacas;

        const pesos = vacas.map((vaca) => {
          return vaca.peso;
        });

        console.log(vacas, pesos);
      });
  }

  /* Metodo para aumentar la paginacion */
  paginationPlus() {
    this.pagination = this.pagination + 1;
    this.getVacas(this.loteId);
  }

  /*Metodo para decrementar la paginacion */
  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getVacas(this.loteId);
  }


}
