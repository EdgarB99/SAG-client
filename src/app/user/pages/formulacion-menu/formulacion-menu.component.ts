import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulacion-menu',
  templateUrl: './formulacion-menu.component.html',
  styleUrls: ['./formulacion-menu.component.css']
})
export class FormulacionMenuComponent implements OnInit {
  
    public dietas: boolean = false;
    public dosis: boolean =false;
    public formula: boolean = false;

  ngOnInit(): void {
    this.formula = JSON.parse(localStorage.getItem('formula')!);
    this.dosis = JSON.parse(localStorage.getItem('dosis')!);
    this.dietas = JSON.parse(localStorage.getItem('dietas')!);
  }


  toFormula(){
    this.formula = true;
    this.dosis = false;
    this.dietas = false;
    localStorage.setItem('formula', 'true');
    localStorage.setItem('dosis', 'false');
    localStorage.setItem('dietas', 'false');
  }

  toDieta(){
    this.dietas = true;
    this.dosis = false;
    this.formula = false;
    localStorage.setItem('dietas', 'true');
    localStorage.setItem('dosis', 'false');
    localStorage.setItem('formula', 'false');
  }

  toDosis(){
    this.dosis = true;
    this.formula = false;
    this.dietas = false;
    
    localStorage.setItem('dosis', 'true');
    localStorage.setItem('formula', 'false');
    localStorage.setItem('dietas', 'false');
  }


}
