import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  public usuario!: Usuario;
  public modal: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    /**ID decodificado del token*/
    const ID = this.userService.decodeUsuarioFromToken();

    this.userService.getUsuarioById(ID!)
      .subscribe(usuario => {
        this.usuario = usuario;
      })

  }


  mostrarModal() {
    if (this.modal) {
      this.modal = false;
      console.log(this.modal);
    } else {
      this.modal = true;
      console.log(this.modal);
    }
  }


}
