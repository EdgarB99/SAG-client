import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css'],
})
export class VenderComponent implements OnInit {
  public vacaId: string = '';
  public vaca!: Vaca;
  public pesos!: Peso[];
  public pesoActual!: Peso;
  public ventaXkg: boolean = true;
  public ventaFija: boolean = false;
  public confirmar: boolean = false;
  public fechaActual: string = moment().format('DD/MM/YYYY');
  public costoVaca: number = 0;
  public precioxKg: number = 0;
  public costoVacaFija: number = 0;
  public precioxKgFija: number = 0;
  public showSnackbar: boolean = false;
  public mensaje: string = '';
  public usuarioId: string = '';


  formVentaKg: FormGroup = this.fb.group({
    precioKg: ['', Validators.required],
  });

  formFijo: FormGroup = this.fb.group({
    precio: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.getVacaById(id)))
      .subscribe((vaca) => {
        this.vacaId = vaca.id!;
        this.vaca = vaca;
        this.pesos = vaca.peso!;
        this.getLastPeso();
        console.log(vaca);
      });
  }

  getLastPeso() {
    this.pesos = this.pesos.sort((a, b) => (a.dia! > b.dia! ? 1 : -1));
    this.pesoActual = this.pesos[this.pesos.length - 1];
    console.log(this.pesoActual);
    
  }

  toFijo() {
    this.ventaFija = true;
    this.ventaXkg = false;
  }

  toPrecioxkg() {
    this.ventaXkg = true;
    this.ventaFija = false;
  }

  toConfirmar(){
    this.confirmar = true;
  }

  cancelar(){
    this.confirmar = false;
  }

  venderVaca(){
    const VACA = {
      vendido: true
    }
    this.userService.updateVaca(this.vacaId,VACA)
    .subscribe( vaca =>{
      console.log(vaca,'actualizado');
      this.crearVenta();
    })
  }

  venderVacaFijo(){
    const VACA = {
      vendido: true
    }
    this.userService.updateVaca(this.vacaId,VACA)
    .subscribe( vaca =>{
      console.log(vaca,'actualizado');
      this.crearVentaFija();
    })
  }

  crearVenta(){
    const VENTA = {
      precioKg: this.formVentaKg.get('precioKg')?.value,
      precioTotal: this.costoVaca,
      fechaVenta: this.fechaActual
    }
    this.userService.createVenta(this.vacaId, VENTA)
    .subscribe( venta => {
      console.log(venta,'creada');
      this.mensaje = 'Vaca Vendida';
      this.toggleSnackbar();
    })
  }


  crearVentaFija(){
    const PRECIOKG = this.formFijo.get('precio')?.value / this.pesoActual.kg;
    const VENTA = {
      precioKg: PRECIOKG,
      precioTotal: this.formFijo.get('precio')?.value,
      fechaVenta: this.fechaActual
    }
    this.userService.createVenta(this.vacaId, VENTA)
    .subscribe( venta => {
      console.log(venta,'creada');
      this.mensaje = 'Vaca Vendida';
      this.toggleSnackbar();
    })
  }

  campoNoValido(campo: string) {
    return (
      (this.formFijo.get(campo)?.invalid &&
        this.formFijo.get(campo)?.touched) ||
      (this.formVentaKg.get(campo)?.invalid &&
        this.formVentaKg.get(campo)?.touched)
    );
  }


  calcular(){
    this.costoVaca = 0;
    this.costoVaca = (this.pesoActual.kg! * this.formVentaKg.get('precioKg')?.value);
    this.precioxKg = this.formVentaKg.get('precioKg')?.value;
  }

  calcularFijo(){
    this.costoVacaFija = 0;
    this.costoVacaFija = this.formFijo.get('precio')?.value;
    this.precioxKgFija = this.formFijo.get('precio')?.value / this.pesoActual.kg;
  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;
    if (this.showSnackbar) {
      setTimeout(() => {
        this.router.navigate([`./user/${this.usuarioId}/vender`]);
      }, 2000);
    }
  }



}
