import { ComisionMiembroDetalle } from './comisionMiembro';
import { ExpedienteDetalle } from './expediente';

export interface Comision {
  idcomision: number;
  nombre_comision: string;
  descripcion: string | null;
  
}

export interface ComisionDetalle {
  idcomision: number;
  nombre_comision: string;
  descripcion: string | null;
  miembros: ComisionMiembroDetalle[];        // Así debe llamarse en tu respuesta
  expedientes: ExpedienteDetalle[]  ;
}

export interface ComisionDetalle2 {
  idcomision: number;
  nombre_comision: string;
  descripcion: string | null;
  miembros: ComisionMiembroDetalle[];        // Así debe llamarse en tu respuesta
  expedientes: ExpedienteDetalle[] | null ;
}

export interface EditableCellComision {
  id: number;
  field: keyof Comision;
  value: string;
}

