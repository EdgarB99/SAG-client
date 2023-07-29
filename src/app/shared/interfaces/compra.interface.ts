export interface Compra{
    id?: string;
    concepto: string;
    fecha: string;
    periodo: string;
    tipo: string;
    cantidad: number;
    precio: number;
    usuarioId?: string;
}