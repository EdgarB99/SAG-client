import * as moment from 'moment';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import { UserService } from '../../user.service';
import { ValidatorService } from '../../../shared/validator.service';
import { NombreRaza_UsuarioId } from 'src/app/shared/interfaces/nombreraza-usuario.interface';
import { NombreLote_UsuarioId } from 'src/app/shared/interfaces/nombrelote-usuarioid.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-vaca',
  templateUrl: './modal-vaca.component.html',
  styleUrls: ['./modal-vaca.component.css']
})
export class ModalVacaComponent implements OnInit {
  public peso!: Peso;
  public loteId!: string;
  public razaId!: string;
  public mensaje: string = '';
  public nombreLote!: string;
  public nombreRaza!: string;
  public comprobar: boolean = false;
  public showSnackbar: boolean = false;
  public loteSelect!: NombreLote_UsuarioId;
  public razaSelect!: NombreRaza_UsuarioId;
  public fechaActual:string = moment().format('DD/MM/YYYY');

  @Input() public vaca!: Vaca;
  @Input() public lotes!: string[];
  @Input() public razas!: string[];
  @Input() public titulo: string = '';
  @Input() public actualizar!: boolean;
  @Input() public usuarioId: string = '';
  @Input() public modalA: boolean = true;
  @Output() public modal = new EventEmitter<boolean>();

  formVaca: FormGroup = this.fb.group({
    arete: ['', [Validators.required, Validators.pattern(this.validatorService.arete)]],
    fechaNacimiento: ['', Validators.required],
    fechaIngreso: ['', Validators.required],
    raza: ['', Validators.required],
    kg: ['', Validators.required],
    lb: ['', Validators.required],
    loteId: ['',],
  });

  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required]
  });

  get areteErrorMsg(): string {

    const errors = this.formVaca.get('arete')?.errors;
    if (errors?.['required']) {
      return 'El arete es obligatorio';
    } else if (errors?.['pattern']) {
      return 'El valor ingresado no tiene formato de arete';
    }
    return '';
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private validatorService: ValidatorService) {

    }

  ngOnInit(): void {

    console.log(this.fechaActual);

    if (this.vaca) {
      this.userService.getLoteById(this.vaca.loteId)
        .subscribe(lote => {
          this.nombreLote = lote.nombreLote;
          this.formNombreLote.reset({
            nombreLote: this.nombreLote
          });

        });
    }

    if (this.actualizar) {
      this.formVaca.reset({
        arete: this.vaca.arete,
        fechaNacimiento: this.vaca.fechaNacimiento,
        fechaIngreso: this.vaca.fechaIngreso,
        raza: this.vaca.raza,
        kg: '',
        lb: '',
        loteId: this.vaca.loteId
      });


    }

    /*Se evalua cuando cambia el contenido del selector*/
    this.formNombreLote.get('nombreLote')?.valueChanges
      .subscribe(nombreLote => {
        this.seleccionLote(this.usuarioId, nombreLote);
      });


    /* Conversion de kg a libras */
    this.formVaca.get('kg')?.valueChanges
    .subscribe( kg => {
      this.formVaca.get('lb')?.setValue(kg * 2.204);
    });
  }

  registerVaca() {
    this.vaca = {
      arete: this.formVaca.get('arete')?.value,
      fechaNacimiento: this.formVaca.get('fechaNacimiento')?.value,
      fechaIngreso: this.formVaca.get('fechaIngreso')?.value,
      raza: this.formVaca.get('raza')?.value,
      vendido: false,
      eliminado: false,
      loteId: this.loteId
    }

    this.userService.createVaca(this.vaca)
      .subscribe(vaca => {
        this.registerPeso(vaca.id!);
        this.mensaje = 'Vaca registrada'
        this.toggleSnackbar();
      });
  }

  /* Metodo para actualizar datos */
  updateVaca() {
    const VACAID = this.vaca.id;
    /* Pasamos los datos necesarios que necesita la vaca */
    this.vaca = {
      arete: this.formVaca.get('arete')?.value,
      fechaNacimiento: this.formVaca.get('fechaNacimiento')?.value,
      fechaIngreso: this.formVaca.get('fechaIngreso')?.value,
      raza: this.formVaca.get('raza')?.value,
      loteId: this.loteId
    }

    this.userService.updateVaca(VACAID!,this.vaca)
    .subscribe( vaca=> {
      this.mensaje = 'Vaca actualizada'
      this.toggleSnackbar();
      console.log(vaca, 'vacaactualizada');
    })
  }

  registerPeso(vacaId:string){
    this.peso =
    {
      dia: this.fechaActual,
      kg: +this.formVaca.get('kg')?.value,
      lb: +this.formVaca.get('lb')?.value,
      vacaId
    };

    this.userService.createPeso(this.peso)
    .subscribe( peso => {})
  }

  modalAction() {
    if (this.modalA) {
      this.modalA = false;
      this.modal.emit(this.modalA);
      this.formVaca.reset();
      this.formNombreLote.reset({
        nombreLote: ''
      });
    } else {
      this.modalA = true;
      this.modal.emit(this.modalA);
      this.formVaca.reset();
      this.formNombreLote.reset({
        nombreLote: ''
      });
    }
  }

  campoNoValido(campo: string) {
    return (this.formVaca.get(campo)?.invalid
      && this.formVaca.get(campo)?.touched) || (this.formNombreLote.get(campo)?.invalid
      && this.formNombreLote.get(campo)?.touched)  ;
  }

  public campoTouched(campo: string){
    return (this.formVaca.get(campo)?.touched) || (this.formNombreLote.get(campo)?.touched) ;
  }

  /*Metodo para seleccionar lote con el selector */
  seleccionLote(id: string, nombreLote: string) {
    /* Variable con interfaz para hacer peticion de un get con el ID del usuario
       y con el nombre del lote */
    this.loteSelect = { id, nombreLote };
    /*Llamada al metodo que hara la peticion */
    this.userService.getLoteByUsuarioIdAndNombreLote(this.loteSelect)
      .subscribe(lote => {
        this.loteId = lote.id!;
        console.log(lote, 'loteSeleccionado');
      })
  }




  toggleSnackbar() {
    this.showSnackbar = !this.showSnackbar;
    console.log('entras');

    if (this.showSnackbar) {
      setTimeout(() => {
        this.showSnackbar = false;
        this.modalA = false;
        this.modal.emit(this.modalA);
        this.formVaca.reset();
        this.formNombreLote.reset();
        location.reload();
      }, 2000);
    }
  }

}
