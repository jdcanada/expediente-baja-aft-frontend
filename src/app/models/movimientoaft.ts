// models/movimientoaft.ts

export interface MovimientoAFT {
  idmovimiento?: number;
  expediente_id: number | null;
  entidad_id: number | null;
  tipo_movimiento_id: number | null;
  hecho_por_id: number | null;
  autorizado_por_id: number | null;
  aprobado_por_id: number | null;
  fecha_movimiento: string | null;
  fundamentacion_operacion: string | null;
}




// models/movimientoaft.ts

import { Expediente } from './expediente'; // o ExpedienteDetalle si quieres anidado
import { Entidad } from './entidad';
import { TipoMovimiento } from './tipoMovimiento';
import { DirectivoDetalle } from './directivo';
import { Persona, PersonaDetalle, PersonaResumen } from './persona';
import { MediobasicoDetalle_Estructura, MedioBasicoResumen } from './medioBasico';
import { DictamenDetalle } from './dictamen';
import { InformeResumenCompleto } from './informeResumen';

export interface MovimientoAFTDetalle {
  idmovimiento: number;
  expediente?: Expediente | null;
  entidad?: Entidad | null;
  tipo_movimiento?: TipoMovimiento | null;
  hecho_por?: DirectivoDetalle | null;
  autorizado_por?: DirectivoDetalle | null;
  aprobado_por?: DirectivoDetalle | null;
  fecha_movimiento: string | null;
  fundamentacion_operacion: string | null;
}




// MovimientoAFT donde el directivo participó
export interface MovimientoAFTResumen {
  idmovimiento: number;
  expediente_id: number | null;
  entidad_id: number | null;
  tipo_movimiento_id: number | null;
  hecho_por_id: number | null;
  autorizado_por_id: number | null;
  aprobado_por_id: number | null;
  fecha_movimiento: string | null;
  fundamentacion_operacion: string | null;
  // Para saber el rol del directivo en este movimiento:
  es_hecho_por: boolean;
  es_autorizado_por: boolean;
  es_aprobado_por: boolean;
}


export interface MovimientoAFTEnriquecido {
  idmovimiento: number;
  fecha_movimiento: string | null;
  fundamentacion_operacion: string | null;
  tipo_movimiento: { idtipo: number; descripcion: string } | null;
  entidad: { identidad: number; nombre_entidad: string } | null;
  expediente: { idexpediente: number; no_expediente: string } | null;
  hecho_por: { iddirectivo: number; nombre: string; apellidos: string } | null;
  autorizado_por: { iddirectivo: number; nombre: string; apellidos: string } | null;
  aprobado_por: { iddirectivo: number; nombre: string; apellidos: string } | null;
  es_hecho_por: boolean;
  es_autorizado_por: boolean;
  es_aprobado_por: boolean;
}



export interface MovimientoResumen {
  idmovimiento: number;
  tipo_movimiento: { idtipo: number; descripcion: string } | null;
  hecho_por: PersonaResumen | null;
  autorizado_por: PersonaResumen | null;
  aprobado_por: PersonaResumen | null;
  fecha_movimiento: string | null;
  fundamentacion_operacion: string | null;
  medios_basicos: MediobasicoDetalle_Estructura[];
}


export interface MedioBasicoListadoEnriquecido {
  idmediobasico: number;
  no_inventario: string | null;
  aft: string | null;
  expediente: {
    idexpediente: number;
    no_expediente: string;
  } | null;
  area: {
    idarea: number;
    nombre_area: string;
    estructura: {
      idestructura: number;
      nombre_estructura: string;
    } | null;
  } | null;
  dictamen: DictamenDetalle | null;
  movimiento: MovimientoAFTDetalle | null;
  informeresumen: InformeResumenCompleto | null;
}

export interface MovimientoAFTCompleto {
  idmovimiento: number;
  fecha_movimiento: string | null;
  fundamentacion_operacion: string | null;
  tipo_movimiento: TipoMovimiento | null;
  entidad: Entidad | null;
  expediente: Expediente | null;
  hecho_por: PersonaDetalle | null;
  autorizado_por: PersonaDetalle | null;
  aprobado_por: PersonaDetalle | null;
  medios_basicos: (MedioBasicoResumen & { dictamen: DictamenDetalle | null })[];
  dictamenes: DictamenDetalle[];
}

export interface MedioBasicoConDictamen extends MedioBasicoResumen {
  dictamen: DictamenDetalle | null;
}

export interface EditableCellMovimientoAft {
  id: number;
  field: keyof MovimientoAFTCompleto;
  value: string;
}
