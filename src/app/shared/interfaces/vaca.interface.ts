import { Peso } from "./peso.interface";
import { Venta } from "./venta.interface";

export interface Vaca{
    id?: string;
    arete: string;
    fechaNacimiento: string;
    fechaIngreso: string;
    raza:string
    vendido?: boolean;
    eliminado?: boolean;
    loteId: string;
    venta?: Venta;
    peso?: Peso[];
}