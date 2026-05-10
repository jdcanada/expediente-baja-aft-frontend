import { Comision, ComisionDetalle2 } from './comision';
import { Estructura } from './estructura';
import { MedioBasicoResumen } from './medioBasico';
import { DictamenDetalle, DictamenDetalle_3, DictamenResumen2 } from './dictamen';
import { MovimientoResumen } from './movimientoaft';
import { InformeResumenDetalle, InformeResumenDetalle3 } from './informeResumen';

export interface Expediente {
  id_expediente?: number;
  numero_expediente: string;
  fecha_creacion: string; // ISO date string
  estado?: string | null;
  estructura_id: number;
  area_id?: number;
   directivo_solicita_id?: number;
      autorizado_por_id?: number| string;
      aprobado_por_id?:  number| string;
      jefe_comision_id?:  number| string;
      causas_generales?: string;
      creado_por_id?:  number| string;
  // Puedes agregar más campos relacionados si lo deseas
}

export interface ExpedientePlano {
  id_expediente: number;
  numero_expediente: string;
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
  total_movimientos?: number;
  total_medios?: number;
}


export interface ExpedienteDetalle_2 {
  id_expediente: number;
  numero_expediente: string;
  fecha_creacion: string | null;
  estado: string | null;
  estructura_id?: number;
  dictamenes?: DictamenDetalle_3[];
  movimientos?: MovimientoResumen[];
  informes_resumen?: InformeResumenDetalle3[];
}


export interface ExpedienteDetalle_4 {
  id_expediente: number;
  numero_expediente: string;
  fecha_creacion: string | null;
  estado?: string;
  comision: Comision | null;
  estructura: Estructura;
  informes_resumen?: InformeResumenDetalle3[];
  mediobasicos: MedioBasicoResumen[],
  dictamenes?: DictamenResumen2[];
  movimientos?: MovimientoResumen[];

    // ✅ AGREGAR ESTOS CAMPOS
  total_medios?: number;
  total_dictamenes?: number;
  total_movimientos?: number;
  estado_validacion?: string;

}

export interface EditableCellExpediente {
  id: number;
  field: keyof ExpedienteDetalle_4;
  value: string;
}
