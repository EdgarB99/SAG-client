import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { ContenidoDieta } from 'src/app/shared/interfaces/contenido-dieta.interface';
import { Compra } from 'src/app/shared/interfaces/compra.interface';

@Component({
  selector: 'app-formulacion',
  templateUrl: './formulacion.component.html',
  styleUrls: ['./formulacion.component.css']
})
export class FormulacionComponent implements OnInit {
  public actualizar: boolean = false;
  public alimentos: ContenidoDieta[] = [];
  public porcentajes: number[] = [];
  public productos: string[] = [];
  public usuarioId!: string;
  public compras!: Compra[];
  public posicion: number = 0;
  public porcentajeFormula: number = 0;
  public porcentajeFaltante: number = 0;
  public nombreDieta: string = 'Nombre de la dieta';
  public showSnackbar: boolean = false;
  public mensaje: string = '';

  formDieta: FormGroup = this.fb.group({
    nombreDieta: ['', Validators.required],
    nombreAlimento: ['', Validators.required],
    porcentaje: ['', Validators.required],
    precio: ['']
  });

  
  constructor(  private userService: UserService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    this.userService.getComprasByUsuarioIdTipoAlimento(this.usuarioId, 0, 0)
    .subscribe( compras => {
      this.compras = compras;
      this.productos = compras.map((compra) => {
        return compra.concepto;
      });
    });

    this.formDieta.get('nombreAlimento')?.valueChanges
    .subscribe( nombre => {
       this.getPrecio(+nombre);
       
    });
  }



  campoNoValido(campo: string) {
    return this.formDieta.get(campo)?.invalid
      && this.formDieta.get(campo)?.touched;
  }

  public campoTouched(campo: string){
    return this.formDieta.get(campo)?.touched;
  }

  addProducto(){
    const ALIMENTO: ContenidoDieta = {
      nombreAlimento: this.compras[this.posicion].concepto,
      porcentaje: this.formDieta.get('porcentaje')?.value,
      precio: this.formDieta.get('precio')?.value
    }
    console.log(ALIMENTO);
    
    this.alimentos.push(ALIMENTO);

    let PORCENTAJE = 0;
    this.alimentos.forEach(alimento => {
      PORCENTAJE += alimento.porcentaje;
    });

    this.porcentajeFormula = PORCENTAJE;
    this.porcentajeFaltante = 100 - PORCENTAJE;
    this.nombreDieta = this.formDieta.get('nombreDieta')?.value;
    console.log(PORCENTAJE);
    

  }

  deleteProducto(posicion: number){
    this.alimentos.splice(posicion,1);
    let PORCENTAJE = 0;

    this.alimentos.forEach(alimento => {
      PORCENTAJE += alimento.porcentaje;
    });

    this.porcentajeFormula = PORCENTAJE;
    this.porcentajeFaltante = 100 - PORCENTAJE;
    console.log(PORCENTAJE);
  }

  getPrecio(posicion: number){
   const PRECIO = this.compras[posicion].precio/this.compras[posicion].cantidad

   this.formDieta.get('precio')?.setValue(PRECIO);

    console.log(PRECIO,'datapadrino');
    this.posicion = posicion;    
  }

  registerDieta(){
    const DIETA = {
      nombreDieta: this.formDieta.get('nombreDieta')?.value,
      usuarioId: this.usuarioId
    }
    this.userService.createDieta(DIETA)
    .subscribe(async dieta => {
      console.log(dieta, 'dieta generada');
      await this.registerContenidoDieta(dieta.id!);
    });

    this.mensaje = 'Dieta Creada'
    this.toggleSnackbar();

  }

  registerContenidoDieta(dietaId: string){
    this.alimentos.forEach(alimento => {
      alimento.dietaId = dietaId;
      console.log(alimento);
      this.userService.createContenido(alimento)
      .subscribe( alimento => {
        console.log(alimento);
      })
    });
    this.alimentos = [];
    this.porcentajeFormula = 0;
    this.porcentajeFaltante = 0;
    this.nombreDieta = 'Nombre de la dieta';
    this.formDieta.reset({
      nombreDieta: '',
      nombreAlimento: '',
      porcentaje: ''
    });
  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;
    if (this.showSnackbar) {
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }

}
