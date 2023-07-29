import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../user.service';

@Pipe({
  name: 'nombreAlimento'
})
export class NombreAlimentoPipe implements PipeTransform {

  public nombreLote!: string;

  constructor( private userService: UserService){}

  async transform(loteId: string): Promise<string> {
    return new Promise ((resolve, reject) => {
    this.userService.getAlimentoById(loteId)
    .subscribe({
      next: alimento => {
        resolve(alimento.nombreAlimento);
      },
      error: () => {reject('')}
    });
    });
  }

}
