import { ContenidoDieta } from "./contenido-dieta.interface";

export interface Dieta{
    id?: string;
    nombreDieta: string;
    contenidoDieta?: ContenidoDieta[]
    usuarioId?: string;

}