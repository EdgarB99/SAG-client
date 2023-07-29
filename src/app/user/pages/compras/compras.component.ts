import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { Compra } from 'src/app/shared/interfaces/compra.interface';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent {
  public usuarioId!: string;
  public compras!: Compra[];
  public compra!: Compra;
  public modal: boolean = false;
  public actualizar: boolean = false;
  public titulo: string = 'Agregar Compra';
  public pagination: number = 0;
  public bloqueoPag: boolean = false;
  public showSnackbar: boolean = false;
  public mensaje: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;

    this.getCompras(this.usuarioId);
  }

  agregarCompra() {
    this.actualizar = false;
    this.titulo = 'Agregar Compra';

    if (this.modal) {
      this.modal = false;
    } else {
      this.modal = true;
    }
  }

  editarCompra(compraId: string) {
    this.actualizar = true;
    this.titulo = 'Editar Compra';

    this.userService.getCompraById(compraId).subscribe((compra) => {
      this.compra = compra;
      /* Se abre la ventana modal */
      if (this.modal) {
        this.modal = false;
      } else {
        this.modal = true;
      }
    });
  }

  getCompras(usuarioId: string) { 
    this.userService
      .getComprasByUsuarioId(usuarioId, 5, this.pagination * 5)
      .subscribe(
        (compras) => {
          this.compras = compras;
          this.bloqueoPag = false;
        },
        (error) => {
          this.pagination = this.pagination - 1;
          this.bloqueoPag = true;
        }
      );
  }

  /* Metodo para aumentar la paginacion */
  paginationPlus() {
    this.pagination = this.pagination + 1;
    this.getCompras(this.usuarioId);
  }

  /*Metodo para decrementar la paginacion */
  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getCompras(this.usuarioId);
  }

  eliminarCompra(compraId: string){
    this.userService.deleteCompras(compraId)
    .subscribe( compra => {
      console.log(compra, 'eliminada');
      this.mensaje = `Compra eliminada`
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
