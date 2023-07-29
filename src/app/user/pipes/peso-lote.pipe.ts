import { Pipe, PipeTransform } from '@angular/core';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { UserService } from '../user.service';

@Pipe({
  name: 'pesoLote'
})
export class PesoLotePipe implements PipeTransform {

  public pesoTotal: number = 0;
  

  constructor( private userService: UserService){}


  async transform(vaca: string): Promise<number> {
  
    return new Promise ((resolve, reject) => {
      this.userService.getPesoByVacaId(vaca)
      .subscribe({
        next: peso => {
          peso = peso.sort((a, b) => (a.dia! > b.dia!) ? 1 : -1);
          const LASTPESO = peso[peso.length - 1];
          this.pesoTotal = this.pesoTotal + LASTPESO.kg!; 
          console.log(this.pesoTotal);
          resolve(this.pesoTotal)
        },
        error: () => {reject('')}
      });
      });
 
   

  }

}

