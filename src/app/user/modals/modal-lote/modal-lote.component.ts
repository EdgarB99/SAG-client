import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-modal-lote',
  templateUrl: './modal-lote.component.html',
  styleUrls: ['./modal-lote.component.css'],
})
export class ModalLoteComponent implements OnInit {
  @Input() public usuarioId: string = '';
  @Input() public titulo: string = 'Registrar Vaca';
  @Input() public modalA: boolean = true;
  @Input() public actualizar!: boolean;
  @Input() public lote!: Lote;
  public comprobar: boolean = false;
  public inputTouched: string = '';
  public campo!: string;
  public showSnackbar: boolean = false;
  public mensaje: string = '';
  public periodos: string[] = ['Semestral', 'Anual'];

  /**outputs para emitir los valores que van a cambiar */
  @Output() public modal = new EventEmitter<boolean>();

  formLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required],
    periodo: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuarioId: [''],
  });

  constructor(private fb: FormBuilder, private userService: UserService) {}

  public ngOnInit(): void {
    console.log(this.lote);
    if (this.lote && this.actualizar) {
      this.formLote.reset({
        nombreLote: this.lote.nombreLote,
        descripcion: this.lote.descripcion,
      });
    }
  }

  public campoNoValido(campo: string) {
    return (
      this.formLote.get(campo)?.invalid && this.formLote.get(campo)?.touched
    );
  }

  public campoTouched(campo: string) {
    return this.formLote.get(campo)?.touched;
  }

  registerLote() {
    this.formLote.get('usuarioId')?.setValue(this.usuarioId);
    this.userService.createLote(this.formLote.value).subscribe((lote) => {
      this.mensaje = 'Lote registrado';
      this.lote = undefined!;
      this.toggleSnackbar();
    });
  }

  updateLote() {
    this.formLote.get('usuarioId')?.setValue(this.usuarioId);
    this.userService
      .updateLote(this.lote.id!, this.formLote.value)
      .subscribe((lote) => {
        console.log(lote, 'actualizado');
        this.mensaje = 'Lote actualizado';
        this.lote = undefined!;
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
      this.lote = undefined!;
    } else {
      this.modalA = true;
      this.modal.emit(this.modalA);
      this.lote = undefined!;
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
