import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {
 
  @Input() public showSnackbar: boolean = false;
  @Input() public mensaje!: string;


    toggleSnackbar() {
      this.showSnackbar = !this.showSnackbar;
     
      
      if (this.showSnackbar) {
        setTimeout(() => {
          this.showSnackbar = false;
          
        }, 3000);
      }
    }

  }
  

