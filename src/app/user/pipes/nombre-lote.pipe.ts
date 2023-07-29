import { Pipe, PipeTransform } from '@angular/core';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { UserService } from '../user.service';

@Pipe({
  name: 'nombreLote'
})
export class NombreLotePipe implements PipeTransform {

  public nombreLote!: string;

  constructor( private userService: UserService){}

  async transform(loteId: string): Promise<string> {
    return new Promise ((resolve, reject) => {
    this.userService.getLoteById(loteId)
    .subscribe({
      next: lote => {
        resolve(lote.nombreLote)
      },
      error: () => {reject('')}
    });
    });
  }

}
