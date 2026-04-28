import { Area, AreaDetalle } from './area';
import { Caracteristica } from './caracteristica';
import { Clasificacion } from './clasificacion';
import { DictamenDetalle } from './dictamen';
import { ExpedienteDetalle_2 } from './expediente';
import { InformeResumenCompleto, InformeResumenDetalle } from './informeResumen';
import { MovimientoAFTDetalle } from './movimientoaft';


export interface Mediobasico {
  idmediobasico?: number;
  no_inventario: string;
  aft: string;
  area_id: number | null;
  caracteristica_id: number | null;
  clasificacion_id: number | null;
  dictamen_id: number | null;
  movimiento_id: number;
  informeresumen_id: number;
}

export interface MediobasicoDetalle_Estructura {
   idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;
  clasificacion: { idclasificacion: number; descripcion: string } | null;
  caracteristica: { idcaracteristica: number; descripcion_c: string } | null;
  area: Area | null;
}

export interface MediobasicoDetalle {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;

  area?: AreaDetalle | null;
  caracteristica?: Caracteristica | null;
  clasificacion?: Clasificacion | null;
  dictamen?: DictamenDetalle | null;
  movimiento?: MovimientoAFTDetalle | null;
  informeresumen?: InformeResumenDetalle | null;
}

export interface MedioBasicoResumen {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;

  area: Area | null;
  clasificacion: { idclasificacion: number; descripcion: string } | null;
  dictamen_id: number | null; // <-- Añadido para forzar traer el número de dictamen
  caracteristica: { idcaracteristica: number; descripcion_c: string } | null;
  no_dictamen?: string | null; // Si quieres mostrar el número de dictamen
}


export interface MediobasicoDetalleCompleto {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;
  area?: AreaDetalle | null;
  caracteristica?: Caracteristica | null;
  clasificacion?: Clasificacion | null;
  dictamen?: DictamenDetalle | null;
  movimiento?: MovimientoAFTDetalle | null;
  informeresumen?: InformeResumenCompleto | null; // Aquí puedes anidar todos los MB asociados al informe, personas, etc.
  // Si quieres, puedes agregar:
  // otrosMBEnInforme?: MedioBasicoResumen[]; // Array de MB asociados al mismo informe
  // otrosMBEnDictamen?: MedioBasicoResumen[]; // Array de MB asociados al mismo dictamen
}

// models/medioBasico.ts



export interface MedioBasicoEnriquecido {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;
  area: AreaDetalle | null;
  caracteristica: Caracteristica | null;
  clasificacion: Clasificacion | null;
  dictamen: DictamenDetalle | null;
  movimiento: MovimientoAFTDetalle | null;
  informeresumen: InformeResumenCompleto | null;
  expediente: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string | null;
    estado: string | null;
    estructura: {
      idestructura: number;
      nombre_estructura: string;
      codigo_centro_costo: string | null;
    } | null;
  } | null;
}

export interface MedioBasicoConDictamen extends MedioBasicoResumen {
  dictamen: DictamenDetalle | null;
}

export interface MedioBasicoPlano {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;
  area_id: number | null;
  caracteristica_id: number | null;
  clasificacion_id: number | null;
  dictamen_id: number | null;

  area_nombre: string | null;
  area_codigo: string | null;

  caracteristica_descripcion: string | null;
  clasificacion_descripcion: string | null;
}


export interface MediobasicoListItem {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;
  expediente: ExpedienteDetalle_2 | null;
  area: AreaDetalle | null;
  caracteristica: Caracteristica | null;
  clasificacion: Clasificacion | null;
  dictamen: DictamenDetalle | null;
  movimiento: MovimientoAFTDetalle | null;
  informeresumen: InformeResumenDetalle | null;
}

export interface MedioBasicoDictamenMasivo {
  // Medio básico
  no_inventario: string;
  aft: string;
  area_id: number;
  caracteristica_id: number;
  clasificacion_id: number;
  movimiento_id: number;
  informeresumen_id: number;

  // Dictamen
  no_dictamen: string | number;
  expediente_id: number;
  directivo_solicita_id: number;
  argumentacion_tecnica: string;
  destino_final: string;
  conclusion_reparable: boolean;
  fecha_dictamen: string; // 'YYYY-MM-DD'
  estructura_solicita_id: number;
  comision_id: number;
}


export interface EditableCellMedioBasico {
  id: number;
  field: keyof Mediobasico;
  value: string;
}



