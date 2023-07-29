export interface Dosificacion{
    id?: string;
    dieta: string;
    fechaInicio: string;
    fechaFinal: string;
    pesoVivoKg: number;
    costoDosificacion: number;
    loteId?: string;
}