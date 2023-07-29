export interface Usuario{
    id?: string;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
}

export interface UsuarioRegister{
  token:string;
}
