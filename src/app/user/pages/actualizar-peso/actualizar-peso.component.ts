import { Component } from '@angular/core';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import * as moment from 'moment';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { UserService } from '../../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-actualizar-peso',
  templateUrl: './actualizar-peso.component.html',
  styleUrls: ['./actualizar-peso.component.css']
})
export class ActualizarPesoComponent {
  public usuarioId!: string;
  public lotes!: string[];
  public lote!: Lote;
  public loteId!: string;
  public vaca!: Vaca;
  public vacaId!: string;
  public aretes!: string[];
  public fecha: string = moment().format('Do MMMM YYYY');
  public fechaActual: string = moment().format('DD/MM/YYYY');
  public fechaPesoActual: string = '';
  public pesos!: Peso[];
  public pesoActual!: Peso;
  public pesoAnterior!: Peso;
  public isDisabled: boolean = true;
  public showSnackbar: boolean = false;
  public mensaje: string = '';

  formPeso: FormGroup = this.fb.group({
    dia: [''],
    kg: ['', Validators.required],
    lb: ['', Validators.required],
    vacaId: [''],
  });

  constructor(private userService: UserService, 
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.getVacaById(id)))
      .subscribe((vaca) => {
        this.vacaId = vaca.id!;
        this.vaca = vaca;
        this.pesos = vaca.peso!;
        if (this.pesos.length !== 0) {
          this.getLastPeso();
          this.getPesoAnterior();
        }
      });

          /* Conversion de kg a libras */
    this.formPeso.get('kg')?.valueChanges.subscribe((kg) => {
      this.formPeso.get('lb')?.setValue(kg * 2.204);
    });
  }

  getLastPeso() {
    this.pesos = this.pesos.sort((a, b) => (a.dia! > b.dia! ? 1 : -1));
    this.pesoActual = this.pesos[this.pesos.length - 1];
    this.fechaPesoActual = this.pesoActual.dia!;
    console.log(
      'peso',
      this.pesoActual,
      'day',
      this.fechaPesoActual,
      'day2',
      this.fechaActual
    );
  }

  getPesoAnterior() {
    this.pesos = this.pesos.sort((a, b) => (a.dia! > b.dia! ? 1 : -1));
    this.pesoAnterior = this.pesos[this.pesos.length - 2];
    console.log('peso', this.pesoAnterior);
  }

  campoNoValido(campo: string) {
    return (
      this.formPeso.get(campo)?.invalid && this.formPeso.get(campo)?.touched
    );
  }

  registerPeso() {
    this.formPeso.get('dia')?.setValue(this.fechaActual);
    this.formPeso.get('vacaId')?.setValue(this.vacaId);
    this.userService.createPeso(this.formPeso.value).subscribe((peso) => {
      this.pesoAnterior = this.pesoActual;
      this.pesoActual = peso;
      this.fechaPesoActual = peso.dia!;
      this.formPeso.reset();
      this.mensaje= 'Peso Actualizado';
      this.toggleSnackbar();
    });
  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;
    if (this.showSnackbar) {
      setTimeout(() => {
        this.router.navigate([`./user/${this.usuarioId}/tareas`]);
      }, 2000);
    }
  }


}
