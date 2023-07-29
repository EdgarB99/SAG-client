import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../user.service';

@Pipe({
  name: 'nombreRaza'
})
export class NombreRazaPipe implements PipeTransform {

  public nombreLote!: string;

  constructor( private userService: UserService){}

  async transform(razaId: string): Promise<string> {
    return new Promise ((resolve, reject) => {
    this.userService.getRazaById(razaId)
    .subscribe({
      next: raza => {
        resolve(raza.nombreRaza)
      },
      error: () => {reject('')}
    });
    });
  }

}
