// models/dictamen.ts

import { ComisionMiembro } from './comisionMiembro';
import { Entidad } from './entidad';
import { InformeResumenEnriquecido } from './informeResumen';
import { MediobasicoDetalle_Estructura, MedioBasicoResumen } from './medioBasico';
import { MovimientoAFTEnriquecido } from './movimientoaft';
import { Persona, PersonaResumen } from './persona';

export interface Dictamen {
  iddictamen?: number;
  no_dictamen: string;
  expediente_id: number;
  mediobasico_id: number;
  directivo_solicita_id: number;
  caracteristica_id?: number | null;
  argumentacion_tecnica?: string | null;
  destino_final?: string | null;
  conclusion_reparable: boolean;
  fecha_dictamen?: string | null;
  estructura_solicita_id?: number | null;
  comision_id: number;
}

export interface DictamenPlano {
  iddictamen: number;
  expediente_id: number;
  mediobasico_id: number;
  directivo_solicita_id: number | null;
  caracteristica_id: number | null;
  estructura_solicita_id: number | null;
  comision_id: number | null;
  argumentacion_tecnica: string | null;
  destino_final: string | null;
  fecha_dictamen: string | null; // o Date si lo manejas así
  conclusion_reparable: number; // o boolean

  // Estructura solicitante
  estructura_nombre: string;
  estructura_codigo_centro_costo: string;
  estructura_id: number;

  // Entidad asociada
  entidad_nombre: string;
  entidad_descripcion: string;
  entidad_id: number;

  // Medio básico
  mediobasico_no_inventario: string;
  mediobasico_aft: string;

  // Característica y clasificación del medio básico
  caracteristica_descripcion: string;
  clasificacion_descripcion: string;

  // Directivo
  directivo_telefono_corporativo: string | null;
  directivo_id: number | null;
}



export interface DictamenDetalle {
  iddictamen: number;
  argumentacion_tecnica?: string | null;
  destino_final?: string | null;
  conclusion_reparable: boolean;
  fecha_dictamen?: string | null;

  expediente: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string;
    estado: string;

  } | null;

  comision: {
    idcomision: number;
    nombre_comision: string;
    comisionmiembros?: ComisionMiembro[];
  } | null;

  estructura: {
    idestructura: number;
    nombre_estructura: string;
    codigo_centro_costo: string;
  }  | null;

  entidad: {
    identidad: number;
    nombre_entidad: string;
  } | null;

  mediobasico: {
    idmediobasico: number;
    no_inventario: string;
    aft: string;

    caracteristica?: {
      idcaracteristica: number;
      descripcion_c: string;
    } | null;

    clasificacion: {
      idclasificacion: number;
      descripcion: string;
    } | null;

    area: {
      idarea: number;
      nombre_area: string;
      codigo_area: string;
      estructura_id?: number;
    } | null;

  } | null;


  directivo_solicita?: {
    iddirectivo: number;
    telefono_corporativo?: string | null;
    persona: {
      idpersona: number;
      identidad?: string;
      nombre: string;
      apellidos: string;
      correo: string;
      cargo: {
        idcargo: number;
        nombre_cargo: string;
        es_directivo: boolean;
      } | null;
    } | null;
  } | null;


}


export interface DictamenResumen {
  iddictamen: number;
  no_dictamen: string;
  fecha_dictamen: string | null;
  argumentacion_tecnica: string | null;
  destino_final: string | null;
  conclusion_reparable: boolean;
  directivo_solicita: Persona | null;
  comision: { idcomision: number; nombre_comision: string } | null;
  mediosbasico: MedioBasicoResumen | null;
}

export interface DictamenResumen2 {
  iddictamen: number;
  no_dictamen?: string | null;
  argumentacion_tecnica: string;
  destino_final: string | null;
  conclusion_reparable: boolean;
  expediente_id: number;
  mediobasico_id: number;
  directivo_solicita_id: number | null;
  caracteristica_id: number | null;
  fecha_dictamen: string | null;
  estructura_solicita_id: number | null;
  comision_id: number | null;
  mediosbasico: MedioBasicoResumen; // <- este campo es requerido
}



export interface DictamenEnriquecido {
  iddictamen: number;
  no_dictamen: string;
  argumentacion_tecnica: string | null;
  destino_final: string | null;
  conclusion_reparable: boolean;
  fecha_dictamen: string | null;
  // Expediente
  expediente: {
    idexpediente: number;
    no_expediente: string;
    estado: string | null;
  } | null;
  // Medio básico
  mediobasico: {
    idmediobasico: number;
    no_inventario: string | null;
    aft: string | null;
    clasificacion: { idclasificacion: number; descripcion: string } | null;
    caracteristica: { idcaracteristica: number; descripcion_c: string } | null;
    area: { idarea: number; nombre_area: string; codigo_area: string | null } | null;
  } | null;
  // Comision
  comision: { idcomision: number; nombre_comision: string } | null;
}


export interface DirectivoAccionesEnriquecido {
  dictamenes: DictamenEnriquecido[];
  movimientos: MovimientoAFTEnriquecido[];
  informesResumen: InformeResumenEnriquecido[];
}

// DictamenDetalle
export interface DictamenDetalle_3 {
  iddictamen: number;
  argumentacion_tecnica: string | null;
  destino_final: string | null;
  conclusion_reparable: boolean;
  fecha_dictamen: string | null;
  mediobasico: MediobasicoDetalle_Estructura | null;
  directivo_solicita: {
    iddirectivo: number;
    telefono_corporativo: string | null;
    persona: PersonaResumen | null;
  } | null;
  comision: { idcomision: number; nombre_comision: string } | null;
  expediente: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string | null;
    estado: string | null;
  };
  estructura: {
    idestructura: number;
    nombre_estructura: string;
    codigo_centro_costo: string;
  };
  entidad: Entidad;
}


export interface DictamenListado {
  iddictamen: number;
  no_dictamen: number | null;
  argumentacion_tecnica: string;
  destino_final: string | null;
  conclusion_reparable: boolean;
  fecha_dictamen: string | null;

  expediente: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string | null;
    estado: string | null;
    estructura?: {
      idestructura: number;
      nombre_estructura: string;
      codigo_centro_costo: string | null;
      entidad?: {
        identidad: number;
        nombre_entidad: string;
      } | null;
    } | null;
  } | null;

  mediobasico: {
    idmediobasico: number;
    no_inventario: string | null;
    aft: string | null;
    clasificacion?: {
      idclasificacion: number;
      descripcion: string;
    } | null;
    caracteristica?: {
      idcaracteristica: number;
      descripcion_c: string;
    } | null;
    area?: {
      idarea: number;
      nombre_area: string;
      codigo_area: string | null;
    } | null;
  } | null;

  comision: {
    idcomision: number;
    nombre_comision: string;
  } | null;

  directivo_solicita: {
    idpersona: number;
    nombre: string;
    apellidos: string;
    solapin: string;
    correo: string;
    telefono_corporativo?: string | null;
    cargo?: {
      idcargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    } | null;
  } | null;

  caracteristica_en_dictamen?: {
    idcaracteristica: number;
    descripcion_c: string;
  } | null;
}




export interface EditableCellDictamen {
  id: number;
   field: keyof DictamenListado;
   value: string;
}

