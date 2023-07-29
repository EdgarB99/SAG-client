import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getTheme();
  }
  title = 'frontend_cow';
  theme:boolean=true;

  getTheme(){
    const localData = localStorage.getItem("theme");

      if (localData == null) {
        localStorage.setItem("theme", "true");
      }

      if (localData === 'false') {
        this.theme = false
      } else if (localData == "true") {
        this.theme = true;
      }
 
   }


}
