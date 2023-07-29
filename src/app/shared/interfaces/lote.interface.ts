import { Alimentacion } from "./alimentacion.interface";
import { Dosificacion } from "./dosificacion.interface";
import { Vaca } from "./vaca.interface";

export interface Lote{
    id?: string;
    nombreLote: string;
    descripcion: string;
    periodo?:string;
    vacas?: Vaca[];
    dosificacion?: Dosificacion[];
    usuarioId: string;
}

