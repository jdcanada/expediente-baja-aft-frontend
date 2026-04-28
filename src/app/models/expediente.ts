import { Comision, ComisionDetalle2 } from './comision';
import { Estructura } from './estructura';
import { MedioBasicoResumen } from './medioBasico';
import { DictamenDetalle, DictamenDetalle_3, DictamenResumen2 } from './dictamen';
import { MovimientoResumen } from './movimientoaft';
import { InformeResumenDetalle, InformeResumenDetalle3 } from './informeResumen';

export interface Expediente {
  idexpediente?: number;
  no_expediente: string;
  fecha_creacion: string; // ISO date string
  estado?: string | null;
  estructura_id: number;
  // Puedes agregar más campos relacionados si lo deseas
}

export interface ExpedientePlano {
  idexpediente: number;
  no_expediente: string;
  fecha_creacion: string;
  estado?: string | null;
  estructura_id: number;
  estructura_nombre: string;
  estructura_codigo_centro_costo: string;
  entidad_id: number;
  entidad_nombre: string;
  entidad_descripcion: string;
}



// Finalmente, ExpedienteDetalle extiende Expediente e incluye relaciones completas
export interface ExpedienteDetalle extends Expediente {

  comision?: ComisionDetalle2 | null;
  estructura?: Estructura | null;
  informes_resumen?: InformeResumenDetalle | null;
  mediobasicos: MedioBasicoResumen[];
  dictamenes: DictamenDetalle[];
  movimientos: MovimientoResumen[];
}

export interface ExpedienteDetalle_3 extends Expediente {

  comision?: ComisionDetalle2 | null;
  estructura?: Estructura | null;
  informes_resumen?: InformeResumenDetalle | null;
  mediobasicos: MedioBasicoResumen[];
  dictamenes: DictamenResumen2[];
  movimientos: MovimientoResumen[];
}


export interface ExpedienteDetalle_2 {
  idexpediente: number;
  no_expediente: string;
  fecha_creacion: string | null;
  estado: string | null;
  estructura_id?: number;
  dictamenes?: DictamenDetalle_3[];
  movimientos?: MovimientoResumen[];
  informes_resumen?: InformeResumenDetalle3[];
}


export interface ExpedienteDetalle_4 {
  idexpediente: number;
  no_expediente: string;
  fecha_creacion: string | null;
  estado: string | null;
  comision: Comision | null;
  estructura: Estructura;
  informes_resumen?: InformeResumenDetalle3[];
  mediobasicos: MedioBasicoResumen[],
  dictamenes?: DictamenResumen2[];
  movimientos?: MovimientoResumen[];
}

export interface EditableCellExpediente {
  id: number;
  field: keyof ExpedienteDetalle_4;
  value: string;
}
