import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Raza } from 'src/app/shared/interfaces/raza.interface';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-modal-raza', 
  templateUrl: './modal-raza.component.html',
  styleUrls: ['./modal-raza.component.css']
})
export class ModalRazaComponent implements OnInit {

  @Input() public usuarioId: string = '';
  @Input() public titulo: string = 'Registrar Raza';
  @Input() public modalA: boolean = true;
  @Input() public actualizar!: boolean;
  @Input() public raza!: Raza;
  public comprobar: boolean = false;
  public inputTouched: string = '';
  public campo!: string;

  public showSnackbar: boolean = false ;
  public mensaje: string = ''

  /**outputs para emitir los valores que van a cambiar */
  @Output() public modal = new EventEmitter<boolean>();

  formRaza: FormGroup = this.fb.group({
    nombreRaza: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuarioId: ['']
  });

  constructor( private fb: FormBuilder,
               private userService: UserService) { }

  ngOnInit(): void {
    console.log(this.raza);
    if(this.raza && this.actualizar){
      this.formRaza.reset({
        nombreRaza: this.raza.nombreRaza,
        descripcion: this.raza.descripcion
      })
    }
  }

  campoNoValido(campo: string) {
    return this.formRaza.get(campo)?.invalid
      && this.formRaza.get(campo)?.touched;
  }

  public campoTouched(campo: string){
    return this.formRaza.get(campo)?.touched;
  }

  registerRaza(){
    this.formRaza.get('usuarioId')?.setValue(this.usuarioId);
    this.userService.createRaza(this.formRaza.value)
    .subscribe(raza => {
      console.log(raza, 'creado');
      this.mensaje = 'Raza registrada';
      this.raza = undefined!;
      this.toggleSnackbar();
    })
  }

  updateRaza(){
    
    this.formRaza.get('usuarioId')?.setValue(this.usuarioId);
    this.userService.updateRaza(this.raza.id!, this.formRaza.value)
    .subscribe( lote => {
      console.log(lote, 'actualizado');
      this.mensaje = 'Raza actualizada';
      this.raza = undefined!;
      this.comprobar = false;
      this.toggleSnackbar();
    });
  }

  confirm(){
    this.comprobar = true;
  }

  modalAction() {
    if (this.modalA) {
      this.modalA = false;
      this.modal.emit(this.modalA);
      this.raza = undefined!;
    } else {
      this.modalA = true;
      this.modal.emit(this.modalA);
      this.raza = undefined!;
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
