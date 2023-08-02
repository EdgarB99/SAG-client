import { Vaca } from '../shared/interfaces/vaca.interface';
import { Lote } from '../shared/interfaces/lote.interface';
import { Raza } from '../shared/interfaces/raza.interface';
import { Peso } from '../shared/interfaces/peso.interface';
import { Login } from '../shared/interfaces/login.interface';
import { Usuario } from '../shared/interfaces/usuario.interface';
import { Alimento } from '../shared/interfaces/alimento.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UpdateVaca } from '../shared/interfaces/updateVaca.interface';
import { UpdateLote } from '../shared/interfaces/update-lote.interface';
import { UpdateRaza } from '../shared/interfaces/update-raza.interface';
import { LoteArete } from '../shared/interfaces/lote-arete.interface';
import { Alimentacion } from '../shared/interfaces/alimentacion.interface';
import { UpdateUsuario } from '../shared/interfaces/update-usuario.interface';
import { UpdateAlimento } from '../shared/interfaces/update-alimento.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NombreLote_UsuarioId } from '../shared/interfaces/nombrelote-usuarioid.interface';
import { NombreRaza_UsuarioId } from '../shared/interfaces/nombreraza-usuario.interface';
import { NombreAlimento_UsuarioId } from '../shared/interfaces/nombrealimento-usuarioid.interface';
import { Compra } from '../shared/interfaces/compra.interface';
import { UpdateCompra } from '../shared/interfaces/update-compra.interface';
import { Concepto_UsuarioId } from '../shared/interfaces/concepto-usuario.interface';
import { Dieta } from '../shared/interfaces/dieta.interface';
import { ContenidoDieta } from '../shared/interfaces/contenido-dieta.interface';
import { Dosificacion } from '../shared/interfaces/dosificacion.interface';
import { DietaUsuario } from '../shared/interfaces/dieta-usuario.interface';
import { Venta } from '../shared/interfaces/venta.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public baseUrl = 'https://sag-production.up.railway.app';

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {}

  /** Metodo para decodificar el id del usuario desde el localstorage */
  decodeUsuarioFromToken() {
    let TOKEN = localStorage.getItem('token')!;
    const USUARIO: Usuario = this.jwtHelper.decodeToken(TOKEN)!;
    const USUARIOID = USUARIO.id;
    return USUARIOID;
  }

  /**USUARIO*/

  public getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/auth/${id}`);
  }

  public updateUsuario(
    id: string,
    usuario: UpdateUsuario
  ): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/auth/${id}`, usuario);
  }

  public getAuth(login: Login): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}/auth/login`, login);
  }

  /* VACAS */

  public createVaca(vaca: Vaca): Observable<Vaca> {
    return this.http.post<Vaca>(`${this.baseUrl}/vacas/create-vaca`, vaca);
  }

  public updateVaca(id: string, vaca: UpdateVaca): Observable<UpdateVaca> {
    return this.http.patch<UpdateVaca>(`${this.baseUrl}/vacas/${id}`, vaca);
  }

  public deleteVaca() {}

  public getVacaById(id: string): Observable<Vaca> {
    return this.http.get<Vaca>(`${this.baseUrl}/vacas/${id}`);
  }

  public getVacasByLoteId(id: string, limit: number, offset: number) {
    return this.http.get<Vaca[]>(
      `${this.baseUrl}/vacas/lote/${id}/${limit}/${offset}`
    );
  }

  public getVacasVendidasByLoteId(id: string, limit: number, offset: number) {
    return this.http.get<Vaca[]>(
      `${this.baseUrl}/vacas/loteV/${id}/${limit}/${offset}`
    );
  }

  public getVacaByLoteIdAndArete(loteIdArete: LoteArete) {
    return this.http.post<Vaca>(`${this.baseUrl}/vacas/arete`, loteIdArete);
  }

  /* LOTES */

  public createLote(lote: Lote): Observable<Lote> {
    return this.http.post<Lote>(`${this.baseUrl}/lote/createLote`, lote);
  }

  public updateLote(id: string, lote: UpdateLote) {
    return this.http.patch<Lote>(`${this.baseUrl}/lote/${id}`, lote);
  }

  public getLoteById(id: string) {
    return this.http.get<Lote>(`${this.baseUrl}/lote/${id}`);
  }

  public getLoteByUsuarioId(id: string, limit: number, offset: number) {
    return this.http.get<Lote[]>(
      `${this.baseUrl}/lote/usuario/${id}/${limit}/${offset}`
    );
  }

  public getLoteByUsuarioIdAndNombreLote(
    nombreLoteUsuarioId: NombreLote_UsuarioId
  ) {
    return this.http.post<Lote>(
      `${this.baseUrl}/lote/nombre`,
      nombreLoteUsuarioId
    );
  }

  /* RAZAS */

  public createRaza(raza: Raza) {
    return this.http.post<Raza>(`${this.baseUrl}/raza`, raza);
  }

  public updateRaza(id: string, raza: UpdateRaza) {
    return this.http.patch<Raza>(`${this.baseUrl}/raza/${id}`, raza);
  }

  public getRazaById(id: string) {
    return this.http.get<Raza>(`${this.baseUrl}/raza/${id}`);
  }

  public getRazaByUsuarioId(id: string, limit: number, offset: number) {
    return this.http.get<Raza[]>(
      `${this.baseUrl}/raza/usuario/${id}/${limit}/${offset}`
    );
  }

  public getRazaByUsuarioIdAndNombreRaza(
    nombreRazaUsuarioId: NombreRaza_UsuarioId
  ) {
    return this.http.post<Raza>(
      `${this.baseUrl}/raza/nombre`,
      nombreRazaUsuarioId
    );
  }

  /* ALIMENTOS */

  public createAlimento(alimento: Alimento) {
    return this.http.post<Alimento>(`${this.baseUrl}/alimento`, alimento);
  }

  public updateAlimento(id: string, alimento: UpdateAlimento) {
    return this.http.patch<Alimento>(
      `${this.baseUrl}/alimento/${id}`,
      alimento
    );
  }

  public getAlimentoById(id: string) {
    return this.http.get<Alimento>(`${this.baseUrl}/alimento/${id}`);
  }

  public getAlimentoByUsuarioId(id: string, limit: number, offset: number) {
    return this.http.get<Alimento[]>(
      `${this.baseUrl}/alimento/usuario/${id}/${limit}/${offset}`
    );
  }

  public getAlimentoByUsuarioIdAndNombreAlimento(
    nombreAlimentoUsuarioId: NombreAlimento_UsuarioId
  ) {
    return this.http.post<Alimento>(
      `${this.baseUrl}/alimento/nombre`,
      nombreAlimentoUsuarioId
    );
  }

  /*PESO */

  public createPeso(peso: Peso) {
    return this.http.post<Peso>(`${this.baseUrl}/peso/create-peso`, peso);
  }

  public getPesoByVacaId(id: string) {
    return this.http.get<Peso[]>(`${this.baseUrl}/peso/vaca/${id}`);
  }

  /* ALIMENTACION */

  public createAlimentacion(alimentacion: Alimentacion) {
    return this.http.post<Alimentacion>(
      `${this.baseUrl}/alimentacion`,
      alimentacion
    );
  }

  /* COMPRAS */

  public createCompra(compra: Compra) {
    return this.http.post<Compra>(`${this.baseUrl}/compras/create-compra`, compra);
  }

  public updateCompra(id: string, compra: UpdateCompra) {
    return this.http.patch<Compra>(`${this.baseUrl}/compras/${id}`, compra);
  }

  public getCompraById(id: string) {
    return this.http.get<Compra>(`${this.baseUrl}/compras/${id}`);
  }

  public getComprasByUsuarioId(id: string, limit: number, offset: number) {
    return this.http.get<Compra[]>(
      `${this.baseUrl}/compras/usuario/${id}/${limit}/${offset}`
    );
  }

  public deleteCompras(id: string){
    return this.http.delete<Compra>(`${this.baseUrl}/compras/${id}`);
  }

  public getComprasByUsuarioIdTipoAlimento(
    id: string,
    limit: number,
    offset: number
  ) {
    return this.http.get<Compra[]>(
      `${this.baseUrl}/compras/usuarioA/${id}/${limit}/${offset}`
    );
  }

  public getCompraByUsuarioIdAndConcepto(
    conceptoUsuarioId: Concepto_UsuarioId
  ) {
    return this.http.post<Alimento>(
      `${this.baseUrl}/compras/nombre`,
      conceptoUsuarioId
    );
  }

  /* DIETAS */

  public createDieta(dieta: Dieta) {
    return this.http.post<Dieta>(`${this.baseUrl}/dietas`, dieta);
  }

  public updateDieta(id: string, dieta: Dieta) {
    return this.http.patch<Dieta>(`${this.baseUrl}/dietas/${id}`, dieta);
  }

  public getDietaById(id: string) {
    return this.http.get<Dieta>(`${this.baseUrl}/dietas/${id}`);
  }

  public getDietasByUsuarioId(id: string, limit: number, offset: number) {
    return this.http.get<Dieta[]>(
      `${this.baseUrl}/dietas/usuario/${id}/${limit}/${offset}`
    );
  }

   public getDietaByUsuarioIdAndName(dietaUsuarioId: DietaUsuario){
     return this.http.post<Dieta>(`${this.baseUrl}/dietas/nombre`, dietaUsuarioId)
   }

   public deleteDieta(id: string){
    return this.http.delete<Dieta>(`${this.baseUrl}/dietas/${id}`);
  }

  /* CONTENIDO DE DIETA */

  public createContenido(contenido: ContenidoDieta) {
    return this.http.post<ContenidoDieta>(
      `${this.baseUrl}/contenido-dieta`,
      contenido
    );
  }

  public updateContenido(id: string, contenido: ContenidoDieta) {
    return this.http.patch<ContenidoDieta>(
      `${this.baseUrl}/contenido-dieta/${id}`,
      contenido
    );
  }

  public getContenidoById(id: string) {
    return this.http.get<ContenidoDieta>(
      `${this.baseUrl}/contenido-dieta/${id}`
    );
  }

  public getContenidosByDietaId(id: string, limit: number, offset: number) {
    return this.http.get<ContenidoDieta[]>(
      `${this.baseUrl}/contenido-dieta/usuario/${id}/${limit}/${offset}`
    );
  }

  public deleteContenidoDieta(id: string){
    return this.http.delete<ContenidoDieta>(`${this.baseUrl}/contenido-dieta/${id}`);
  }



  /* DOSIFICACION */

  public createDosis(dosis: Dosificacion) {
    return this.http.post<Dosificacion>(`${this.baseUrl}/dosificacion`, dosis);
  }

  public updateDosis(id: string, dieta: Dosificacion) {
    return this.http.patch<Dosificacion>(`${this.baseUrl}/dosificacion/${id}`, dieta);
  }

  public getDosisById(id: string) {
    return this.http.get<Dosificacion>(`${this.baseUrl}/dosificacion/${id}`);
  }

  public getDosisByLoteId(id: string, limit: number, offset: number) {
    return this.http.get<Dosificacion[]>(
      `${this.baseUrl}/dosificacion/lote/${id}/${limit}/${offset}`
    );
  }

  public deleteDosis(id: string){
    return this.http.delete<Dosificacion>(`${this.baseUrl}/dosificacion/${id}`);
  }

  /* VENTAS */
  public createVenta(vacaId: string, venta: Venta){
    return this.http.post<Venta>(`${this.baseUrl}/ventas/${vacaId}`, venta);
  }

}
