export interface UpdateLote{
    id?: string;
    nombreLote?: string;
    descripcion?: string;
    vendido?:boolean;
    vacas?: [];
    usuarioId?: string;
}