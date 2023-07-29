export interface Alimentacion {
    id?: string;
    fechaInicio: string;
    fechaFinal: string;
    kgAlimentacion: number;
    lbAlimentacion: number;
    costoAlimentacionDia: number;
    costoAlimentacionTotal: number;
    pesoTotalLote: number,
    loteId?: string;
    alimentoId?: string;
}