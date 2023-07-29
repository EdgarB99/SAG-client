import { Pipe, PipeTransform } from '@angular/core';
import { Peso } from 'src/app/shared/interfaces/peso.interface';

@Pipe({
  name: 'lb'
})
export class LbPipe implements PipeTransform {

  transform(peso: Peso[]): unknown {

    peso = peso.sort( (a,b) => (a.dia! > b.dia!) ? 1 : -1 )

    const PESO: Peso = peso[peso.length-1];

    //console.log('peso',peso);
    return PESO.lb;
  }

}
