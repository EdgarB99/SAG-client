export interface Alimento{
    id?:string;
    nombreAlimento: string;
    tipo: string;
    precio: number;
    usuarioId: string;
    alimentacion: [];
}