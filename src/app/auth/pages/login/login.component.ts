import { AfterContentChecked, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/interfaces/usuario.interface';
import { ValidatorService } from 'src/app/shared/validator.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usuario!: Usuario;
  usuarioNotFound!: string;
  passwordInvalid!: string;

  formLogin: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorService.emailPattern),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get emailErrorMsg(): string {
    const errors = this.formLogin.get('email')?.errors;
    if (errors?.['required']) {
      return 'El correo es obligatorio';
    } else if (errors?.['pattern']) {
      return 'Ingrese un correo válido';
    } else if (errors?.['emailTomado']) {
      return 'El correo ya fue tomado';
    }

    return '';
  }

  get passwordErrorMsg(): string {
    const errors = this.formLogin.get('password')?.errors;
    if (errors?.['required']) {
      return 'Ingrese la contraseña';
    } else if (errors?.['invalid']) {
      return 'Contraseña incorrecta';
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
      this.formLogin.get(campo)?.invalid && this.formLogin.get(campo)?.touched
    );
  }

  login() {
    console.log('Datos', this.formLogin.value);

    this.authService.getAuth(this.formLogin.value).subscribe(
      (login) => {
        console.log(login);
        this.usuarioNotFound = '';
        this.passwordInvalid = '';

        localStorage.setItem('token', login.token);
        const usuario: Usuario = this.authService.decodeUserFromToken(
          login.token
        );
        console.log(usuario);

        this.router.navigate([`./user/${usuario.id}/lotes`]);
      },
      (err) => {
        const { error } = err;
        const { message, statusCode } = error;

        if (statusCode === 404) {
          this.usuarioNotFound = message;
        } else if (statusCode === 403) {
          this.passwordInvalid = message;
        }

        console.log(statusCode, message);
      }
    );
  }

  toRegister() {
    this.router.navigate([`./auth/register`]);
  }
}
