import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../user.service';
import * as moment from 'moment';
import { Peso } from 'src/app/shared/interfaces/peso.interface';


@Pipe({
  name: 'actualizarPeso'
})
export class ActualizarPesoPipe implements PipeTransform {

  public fechaActual: string = moment().format('DD/MM/YYYY');

  constructor( private userService: UserService){}

  async transform(vacaId: string) {
    return new Promise ((resolve, reject) => {
      this.userService.getPesoByVacaId(vacaId)
      .subscribe({
        next: peso => {
          peso = peso.sort( (a,b) => (a.dia! > b.dia!) ? 1 : -1 )
          const PESO: Peso = peso[peso.length-1];
      
          
            if(PESO.dia === this.fechaActual){
              //console.log(PESO.dia);
              resolve('Peso de hoy actualizado')
            }else{
              //console.log(PESO.dia);
              resolve('No se ha actualizado el peso de hoy')
            }
        },
        error: () => {reject('Esta vaca no tiene registros')}
      });
      });
  }

}
