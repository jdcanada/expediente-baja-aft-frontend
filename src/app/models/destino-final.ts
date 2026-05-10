export interface DestinoFinal {
  id_destino: number;
  descripcion: string;
  activo: boolean;
}

export interface DestinoFinalSimple {
  id_destino: number;
  descripcion: string;
}

export interface DestinoFinalDetalle extends DestinoFinal {
  total_medios: number;
  total_dictamenes: number;
}