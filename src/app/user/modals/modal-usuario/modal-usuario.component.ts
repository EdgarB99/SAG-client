import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { ValidatorService } from 'src/app/shared/validator.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  /**Inputs para recibir informacion de la página padre */
  @Input() public img: string= 'assets/vaca.png';
  @Input() public titulo: string= 'Actualizar Usuario'
  @Input() public modalA: boolean = true;
  @Input() public usuario!: Usuario;

  /**outputs para emitir los valores que van a cambiar */
  @Output() public modal = new EventEmitter <boolean> ();
  @Output() public usuarioE = new EventEmitter <Usuario> ();

  public usuarioComprobado: boolean = false;
  public autorizarActualizacion: boolean = false;
  public usuarioId!: string;

  formUsuario: FormGroup = this.fb.group({
    nombre: ['', [ Validators.required, Validators.minLength(2) ] ],
    apellidos: ['', [ Validators.required, Validators.minLength(2) ] ],
    email: ['', [ Validators.required, Validators.pattern( this.validatorService.emailPattern)]],
    password: ['', [ Validators.required, Validators.minLength(6) ] ],
    password2: ['', [ Validators.required, Validators.minLength(6) ] ],
  },
  {
    validators: [ this.validatorService.camposIguales('password','password2') ]
  }
  );

  formComprobar: FormGroup = this.fb.group({
    email: [''],
    password: ['', [ Validators.required, Validators.minLength(6) ]],
  })

  get emailErrorMsg(): string {
    const errors = this.formUsuario.get('email')?.errors;
    if ( errors?.['required'] ) {
      return 'El correo es obligatorio';
    } else if ( errors?.['pattern'] ) {
      return 'Ingrese un correo válido';
    } else if ( errors?.['emailTomado'] ) {
      return 'El correo ya fue tomado';
    }
    return '';
  }

 

  constructor( private validatorService:ValidatorService,
               private userService:UserService,
               private fb:FormBuilder ){}


  ngOnInit(): void {
   
  }

   modalAction(){
    if ( this.modalA ){
        this.modalA=false;
        this.modal.emit(this.modalA);
    }else {
      this.modalA=true;
      this.modal.emit(this.modalA);
    }
   }

   campoNoValido( campo: string ) {
    return this.formUsuario.get(campo)?.invalid
            && this.formUsuario.get(campo)?.touched;
  }

  public campoTouched(campo: string){
    return this.formUsuario.get(campo)?.touched;
  }

  comprobar(){
    this.usuarioId = this.usuario.id!;
    const PASSWORD = this.formComprobar.get('password')?.value;

    this.formComprobar.get('email')?.setValue( this.usuario.email );
    this.userService.getAuth( this.formComprobar.value )
    .subscribe( usuario => {
      this.formUsuario.reset({
        nombre:this.usuario.nombre,
        apellidos:this.usuario.apellidos,
        email:this.usuario.email,
        password:PASSWORD,
        password2:PASSWORD,
      });
      console.log( this.usuario );
      this.usuarioComprobado = true;

    },error=>{
      console.log( error );
    })
  }

  comprobarActualizacion(){
    this.autorizarActualizacion=true;
  
  }

  cancelarActualizacion(){
    this.autorizarActualizacion=false;
  }

  actualizar(){

    /*Pasandole la data al interface de usuario */
    this.usuario = {
      nombre: this.formUsuario.get('nombre')?.value,
      apellidos: this.formUsuario.get('apellidos')?.value,
      email: this.formUsuario.get('email')?.value,
      password: this.formUsuario.get('password')?.value
    }
    console.log(this.usuario, 'Usuario padrino');
    /*Llamamos el userService y el metodo para actualizar el usuario */
    this.userService.updateUsuario( this.usuarioId, this.usuario )
    .subscribe( usuario => {
      console.log('Usuario Actualizado', usuario );
      this.usuarioE.emit(usuario);
      this.modalA=false;
      this.modal.emit(this.modalA);
    })
  }

}
