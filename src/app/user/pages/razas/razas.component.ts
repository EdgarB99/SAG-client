import { Component, OnInit } from '@angular/core';
import { Raza } from 'src/app/shared/interfaces/raza.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-razas',
  templateUrl: './razas.component.html',
  styleUrls: ['./razas.component.css']
})
export default class RazasComponent implements OnInit {

  public usuarioId!: string;
  public razas!: Raza[];
  public raza!: Raza;
  public modal: boolean = false;
  public actualizar: boolean = false;
  public titulo: string = 'Agregar Lote';
  public pagination: number = 0;
  public bloqueoPag: boolean = false;

  constructor( private userService: UserService ) { }


  ngOnInit(): void {
    /* Variable que contiene el ID del usuario */
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    /*Llamamos el metodo para el Get de los lotes */
    this.getRazas(this.usuarioId);
  }

  /* Metodo para poder agregar un lote */
  agregarRaza() {
    /* la bandera actualizar pasa a false */
    this.actualizar = false;
    /* El titulo cambia a agregar lote */
    this.titulo = 'Agregar Raza'
    /* Se abre la ventana modal */
    if (this.modal) {
      this.modal = false;
    } else {
      this.modal = true;
    }
  }

  /*Editar lotes */
  editarRaza(loteId: string) {
    this.actualizar = true;
    this.titulo = 'Editar Lote';

    this.userService.getRazaById(loteId)
      .subscribe(raza => {
        this.raza = raza;
        /* Se abre la ventana modal */
        if (this.modal) {
          this.modal = false;
        } else {
          this.modal = true;
        }
      })
  }

  /* Metodo para hacer get de los lotes */
  getRazas(usuarioId: string) {
    /*Hacemos peticion de 5 registros y el offset hara un salto de 5 
     registros para poder obtener los siguientes 5 */
    this.userService.getRazaByUsuarioId(usuarioId, 5, (this.pagination * 5))
      .subscribe(razas => {
        this.razas = razas;
        this.bloqueoPag = false;
      },
      error => {
        this.pagination = this.pagination - 1;
        this.bloqueoPag = true;
      }
      );
  }


  /* Metodo para aumentar la paginacion */
  paginationPlus() {
    this.pagination = this.pagination + 1;
    this.getRazas(this.usuarioId)
  }

  /*Metodo para decrementar la paginacion */
  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getRazas(this.usuarioId)
  }

}