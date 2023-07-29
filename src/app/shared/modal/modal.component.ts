import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() img:string='assets/vaca.png';
  @Input() titulo:string='Actualizar Usuario'

  @Output() modal = new EventEmitter<boolean>;

  modalA: boolean = true;



   modalAction(){


    if(this.modalA){
        this.modalA=false;
    }else{
      this.modalA=true;
    }
   }

}
