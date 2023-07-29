import { Pipe, PipeTransform } from '@angular/core';
import { Peso } from 'src/app/shared/interfaces/peso.interface';

@Pipe({
  name: 'kg'
})
export class KgPipe implements PipeTransform {

  transform(peso: Peso[]): unknown {

    peso = peso.sort( (a,b) => (a.dia! > b.dia!) ? 1 : -1 )

    const PESO: Peso = peso[peso.length-1];

    //console.log('peso',peso);
    return PESO.kg;
  }

}
