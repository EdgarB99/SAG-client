import { Component } from '@angular/core';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/validator.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public usuario!: Usuario;

  formUsuario: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['',[Validators.required,Validators.pattern(this.validatorService.emailPattern),],],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: [
        this.validatorService.camposIguales('password', 'password2'),
      ],
    }
  );

  get emailErrorMsg(): string {
    const errors = this.formUsuario.get('email')?.errors;
    if (errors?.['required']) {
      return 'El correo es obligatorio';
    } else if (errors?.['pattern']) {
      return 'Ingrese un correo válido';
    } else if (errors?.['emailTomado']) {
      return 'El correo ya fue tomado';
    }

    return '';
  }

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private authService: AuthService,
    private router: Router
  ) {}

  campoNoValido(campo: string) {
    return (
      this.formUsuario.get(campo)?.invalid &&
      this.formUsuario.get(campo)?.touched
    );
  }

  registrar() {
    const { nombre, apellidos, email, password } = this.formUsuario.value;
    this.usuario = {
      nombre,
      apellidos,
      email,
      password,
    };
    this.authService.registrarUsuario(this.usuario).subscribe(
      (token) => {
        console.log('token', token.token);
        localStorage.setItem('id', token.token);
        const usuario: Usuario = this.authService.decodeUserFromToken(
          token.token
        );
        console.log(usuario);
        this.router.navigate([`./user/${usuario.id}/lotes`]);
      },
      (err) => {
        const { error } = err;
        const { message } = error;
        console.log(message);
      }
    );
  }

  toLogin() {
    this.router.navigate([`./auth/login`]);
  }
}
