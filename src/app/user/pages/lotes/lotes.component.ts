import { Component, OnInit } from '@angular/core';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit {

  public usuarioId!: string;
  public lotes!: Lote[];
  public lote!: Lote;
  public modal: boolean = false;
  public actualizar: boolean = false;
  public titulo: string = 'Agregar Lote';
  public pagination: number = 0;
  public bloqueoPag: boolean = false;

  constructor(private userService: UserService) { }


  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    this.getLotes(this.usuarioId);
  }

  agregarLote() {
    this.actualizar = false;
    this.titulo = 'Agregar Lote'
    if (this.modal) {
      this.modal = false;
    } else {
      this.modal = true;
    }
  }

  editarLote(loteId: string) {
    this.actualizar = true;
    this.titulo = 'Editar Lote';

    this.userService.getLoteById(loteId)
      .subscribe(lote => {
        this.lote = lote;
        if (this.modal) {
          this.modal = false;
        } else {
          this.modal = true;
        }
      })
  }

  getLotes(usuarioId: string) {
    this.userService.getLoteByUsuarioId(usuarioId, 5, (this.pagination * 5))
      .subscribe(lotes => {
        this.lotes = lotes;
        console.log(this.lotes);
      lotes.map( lote => {
          return lote.vacas?.length
        });

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
    this.getLotes(this.usuarioId)
  }

  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getLotes(this.usuarioId)
  }

}
