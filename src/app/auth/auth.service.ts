import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario, UsuarioRegister } from '../shared/interfaces/usuario.interface';
import { Login } from '../shared/interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://sag-production.up.railway.app';
  errorMsg!: string;
  private _auth: Usuario | undefined;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  registrarUsuario(usuario: Usuario): Observable<UsuarioRegister> {
    return this.http.post<UsuarioRegister>(`${this.baseUrl}/auth`, usuario);
  }

  getAuth(login: Login): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}/auth/login`, login);
  }

  verificaAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      return of(false);
    }

    let token = localStorage.getItem('token')!;
    const usuario: Usuario = this.decodeUserFromToken(token);
    const usuarioId = usuario.id;

    return this.http.get<Usuario>(`${this.baseUrl}/auth/${usuarioId}`).pipe(
      map((auth) => {
        this._auth = auth;
        return true;
      })
    );
  }

  decodeUserFromToken(token: string) {
    return this.jwtHelper.decodeToken(token);
  }
}
