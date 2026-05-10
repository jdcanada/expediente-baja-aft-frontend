import { ExpedienteDetalle_2 } from "./expediente";

export interface Entidad {
  id_entidad: number;
  nombre_entidad: string;
  descripcion: string | null;
}


export interface EntidadDetalleCompleto {
  id_entidad: number;
  nombre_entidad: string;
  descripcion: string | null;
  total_expedientes: number;
  expedientes: ExpedienteDetalle_2[];
}

export interface EditableCellEntidad {
  id: number;
  field: keyof Entidad;
  value: string;
}
