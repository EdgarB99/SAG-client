import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alimento } from 'src/app/shared/interfaces/alimento.interface';
import { UserService } from '../../user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-alimento',
  templateUrl: './modal-alimento.component.html',
  styleUrls: ['./modal-alimento.component.css'],
})
export class ModalAlimentoComponent implements OnInit {
  @Input() public usuarioId: string = '';
  @Input() public titulo: string = 'Registrar Vaca';
  @Input() public modalA: boolean = true;
  @Input() public actualizar!: boolean;
  @Input() public alimento!: Alimento;

  public showSnackbar: boolean = false;
  public mensaje: string = 'Alimento agregado';
  public comprobar: boolean = false;
  public fechaActual: string = moment().format('DD/MM/YYYY');

  /**outputs para emitir los valores que van a cambiar */
  @Output() public modal = new EventEmitter<boolean>();

  formAlimento: FormGroup = this.fb.group({
    nombreAlimento: ['', Validators.required],
    tipo: ['', Validators.required],
    precio: ['', Validators.required],
    usuarioId: [''],
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    console.log(this.alimento);
    if (this.alimento && this.actualizar) {
      this.formAlimento.reset({
        nombreAlimento: this.alimento.nombreAlimento,
        tipo: this.alimento.tipo,
        precio: this.alimento.precio,
      });
    }
  }

  campoNoValido(campo: string) {
    return (
      this.formAlimento.get(campo)?.invalid &&
      this.formAlimento.get(campo)?.touched
    );
  }

  public campoTouched(campo: string) {
    return this.formAlimento.get(campo)?.touched;
  }

  registerAlimento() {
    this.formAlimento.get('usuarioId')?.setValue(this.usuarioId);
    this.userService
      .createAlimento(this.formAlimento.value)
      .subscribe((alimento) => {
        console.log(alimento, 'creado');
        this.mensaje = 'Alimento Registrado';
        this.alimento = undefined!;
        this.toggleSnackbar();
      });
  }

  updateAlimento() {
    this.formAlimento.get('usuarioId')?.setValue(this.usuarioId);
    this.userService
      .updateAlimento(this.alimento.id!, this.formAlimento.value)
      .subscribe((alimento) => {
        console.log(alimento, 'actualizado');
        this.mensaje = 'Alimento Actualizado';
        this.alimento = undefined!;
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
      this.alimento = undefined!;
    } else {
      this.modalA = true;
      this.modal.emit(this.modalA);
      this.alimento = undefined!;
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
