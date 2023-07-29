import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  usuario!:Usuario;
   expandir:boolean = false;
   theme:boolean=true;

   constructor(private userService:UserService,
    private router:Router){}

   ngOnInit(): void {
    this.getTheme();

    const id = this.userService.decodeUsuarioFromToken();

   this.userService.getUsuarioById(id!)
   .subscribe(usuario=>{
     this.usuario=usuario;
   })
  }

   expandSidebar(){

    if(this.expandir)
      this.expandir = false;
    else
      this.expandir = true;
   }


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

   darkOrlight(){
    if(this.theme){
      this.theme = false;
      localStorage.setItem("theme", "false");
    }
    else{
      this.theme = true;
      localStorage.setItem("theme", "true");
    }
   }

   logout(){
    localStorage.removeItem('token');
    this.router.navigate(['./auth/login']);
  }

}

/*
const btn_theme = document.querySelector(".theme-btn");
const theme_ball = document.querySelector(".theme-ball");

      const localData = localStorage.getItem("theme");

      if (localData == null) {
        localStorage.setItem("theme", "light");
      }

      if (localData == "dark") {
        document.body.classList.add("dark-mode");
        theme_ball.classList.add("dark");
      } else if (localData == "light") {
        document.body.classList.remove("dark-mode");
        theme_ball.classList.remove("dark");
      }

      btn_theme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        theme_ball.classList.toggle("dark");
        if (document.body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
      });
*/
