import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { Dieta } from 'src/app/shared/interfaces/dieta.interface';

@Component({
  selector: 'app-dietas',
  templateUrl: './dietas.component.html',
  styleUrls: ['./dietas.component.css']
})
export class DietasComponent {
  public usuarioId!: string;
  public dietas!: Dieta[];
  public dieta!: Dieta;
  public modal: boolean = false;
  public actualizar: boolean = false;
  public pagination: number = 0;
  public bloqueoPag: boolean = false;
  public showSnackbar: boolean = false;
  public mensaje: string = '';

  constructor( private userService: UserService ) { }


  ngOnInit(): void {
    /* Variable que contiene el ID del usuario */
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    /*Llamamos el metodo para el Get de los lotes */
    this.getDietas(this.usuarioId);
  }

  /* Metodo para hacer get de los lotes */
  getDietas(usuarioId: string) {
    /*Hacemos peticion de 5 registros y el offset hara un salto de 5 
     registros para poder obtener los siguientes 5 */
    this.userService.getDietasByUsuarioId(usuarioId, 5, (this.pagination * 5))
      .subscribe(dietas => {
        console.log(dietas);
        
        this.dietas = dietas;
        this.bloqueoPag = false;
      },
      error => {
        this.pagination = this.pagination - 1;
        this.bloqueoPag = true;
      }
      );
  }

  paginationPlus() {
    this.pagination = this.pagination + 1;
    this.getDietas(this.usuarioId);
  }

  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getDietas(this.usuarioId);
  }


  deleteDieta(dietaId:string){
    this.userService.getDietaById(dietaId)
    .subscribe( dieta => {
      dieta.contenidoDieta!.forEach(async contenido => {
        await this.deleteContenido(contenido.id!);
      });

      this.userService.deleteDieta(dieta.id!)
      .subscribe( dieta => {
        console.log(dieta,'eliminada');
        this.mensaje = 'Dieta Eliminada'
        this.toggleSnackbar();
      })

    });
  }

  deleteContenido(contenidoId: string){
    this.userService.deleteContenidoDieta(contenidoId)
    .subscribe( contenido => {
      console.log(contenido,'eliminado');
      
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
