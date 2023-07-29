import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compra } from 'src/app/shared/interfaces/compra.interface';
import { UserService } from '../../user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-compras',
  templateUrl: './modal-compras.component.html',
  styleUrls: ['./modal-compras.component.css'],
})
export class ModalComprasComponent {
  @Input() public usuarioId: string = '';
  @Input() public titulo: string = 'Registrar Compra';
  @Input() public modalA: boolean = true;
  @Input() public actualizar!: boolean;
  @Input() public compra!: Compra;

  public showSnackbar: boolean = false;
  public mensaje: string = 'Compra agregada';
  public comprobar: boolean = false;
  public fechaActual: string = moment().format('DD/MM/YYYY');
  public periodos: string[] = ['Diario', 'Semanal', 'Mensual', 'Anual'];
  public tipos: string[] = ['Alimento', 'Gastos Generales'];
  /**outputs para emitir los valores que van a cambiar */
  @Output() public modal = new EventEmitter<boolean>();

  formCompra: FormGroup = this.fb.group({
    concepto: ['', Validators.required],
    fecha: [''],
    periodo: ['', Validators.required],
    tipo: ['', Validators.required],
    cantidad: ['', Validators.required],
    precio: ['', Validators.required],
    usuarioId: [''],
  });

  constructor( private fb: FormBuilder, 
               private userService: UserService) {
                
               }

  ngOnInit(): void {
    console.log(this.compra);
    if (this.compra && this.actualizar) {
      this.formCompra.reset({
        concepto: this.compra.concepto,
        fecha: this.compra.fecha,
        periodo: this.compra.periodo,
        tipo: this.compra.tipo,
        cantidad: this.compra.cantidad,
        precio: this.compra.precio,
      });
    }
  }

  campoNoValido(campo: string) {
    return (
      this.formCompra.get(campo)?.invalid && this.formCompra.get(campo)?.touched
    );
  }

  public campoTouched(campo: string) {
    return this.formCompra.get(campo)?.touched;
  }

  registerCompra() {
    this.formCompra.get('fecha')?.setValue(this.fechaActual);
    this.formCompra.get('usuarioId')?.setValue(this.usuarioId);
    this.userService.createCompra(this.formCompra.value).subscribe((compra) => {
      console.log(compra, 'creado');
      this.mensaje = 'Compra Registrada';
      this.compra = undefined!;
      this.toggleSnackbar();
    });
  }

  updateCompra() {
    this.formCompra.get('usuarioId')?.setValue(this.usuarioId);
    this.userService
      .updateCompra(this.compra.id!, this.formCompra.value)
      .subscribe((compra) => {
        console.log(compra, 'actualizado');
        this.mensaje = 'Compra Actualizada';
        this.compra = undefined!;
        this.comprobar = false;
        this.toggleSnackbar();
      });
  }

  confirm() {
    this.comprobar = true;
  }

  modalAction() {
    if (this.modalA) {
      this.modalA = false;
      this.modal.emit(this.modalA);
      this.compra = undefined!;
    } else {
      this.modalA = true;
      this.modal.emit(this.modalA);
      this.compra = undefined!;
    }
  }

  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;
    console.log('entras');

    if (this.showSnackbar) {
      setTimeout(() => {
        this.showSnackbar = false;
        this.modalA = false;
        this.modal.emit(this.modalA);
        location.reload();
      }, 2000);
    }
  }
}
