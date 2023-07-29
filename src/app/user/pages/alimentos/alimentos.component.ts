import { Component, OnInit, Output, Input } from '@angular/core';
import { Alimento } from 'src/app/shared/interfaces/alimento.interface';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.component.html',
  styleUrls: ['./alimentos.component.css']
})
export class AlimentosComponent implements OnInit {

  public usuarioId!: string;
  public alimentos!: Alimento[];
  public alimento!: Alimento;
  public modal: boolean = false;
  public actualizar: boolean = false;
  public titulo: string = 'Agregar Alimento';
  public pagination: number = 0;
  public bloqueoPag: boolean = false;


  constructor( private userService: UserService ) { }


  ngOnInit(): void {
    /* Variable que contiene el ID del usuario */
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    /*Llamamos el metodo para el Get de los lotes */
    this.getAlimentos(this.usuarioId);
    
  }

  /* Metodo para poder agregar un lote */
  agregarAlimento() {
    /* la bandera actualizar pasa a false */
    this.actualizar = false;
    /* El titulo cambia a agregar lote */
    this.titulo = 'Agregar Lote'
    /* Se abre la ventana modal */
    if (this.modal) {
      this.modal = false;
    } else {
      this.modal = true;
    }
  }

  /*Editar lotes */
  editarAlimento(alimentoId: string) {
    this.actualizar = true;
    this.titulo = 'Editar Lote';

    this.userService.getAlimentoById(alimentoId)
      .subscribe(alimento => {
        this.alimento = alimento;
        /* Se abre la ventana modal */
        if (this.modal) {
          this.modal = false;
        } else {
          this.modal = true;
        }
      })
  }

  /* Metodo para hacer get de los lotes */
  getAlimentos(usuarioId: string) {
    /*Hacemos peticion de 5 registros y el offset hara un salto de 5 
     registros para poder obtener los siguientes 5 */
    this.userService.getAlimentoByUsuarioId(usuarioId, 5, (this.pagination * 5))
      .subscribe(alimentos => {
        this.alimentos = alimentos;
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
    this.getAlimentos(this.usuarioId)
  }

  /*Metodo para decrementar la paginacion */
  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getAlimentos(this.usuarioId)
  }

}
