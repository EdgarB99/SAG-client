import { Pipe, PipeTransform } from '@angular/core';
import { ContenidoDieta } from 'src/app/shared/interfaces/contenido-dieta.interface';
import { UserService } from '../user.service';

@Pipe({
  name: 'contenido'
})
export class ContenidoPipe implements PipeTransform {

  constructor( private userService: UserService){}

   transform(contenidoDieta: ContenidoDieta[]): string[]{
    let NOMBRES: string[] = [];
    contenidoDieta.forEach(contenido => {
      NOMBRES.push(contenido.nombreAlimento + ' ' + contenido.porcentaje +' % ');
    });
    return NOMBRES;
  }

}
