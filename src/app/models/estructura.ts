import { Area } from "./area";
import { DictamenDetalle, DictamenResumen } from "./dictamen";
import { Entidad } from "./entidad";
import { ExpedienteDetalle_2 } from "./expediente";
import { InformeResumenDetalle } from "./informeResumen";
import { MovimientoAFTDetalle } from "./movimientoaft";
import { Persona, PersonaResumen } from "./persona";

export interface EstructuraSimple {
  id_estructura: number;
  nombre_estructura: string;
}


export interface Estructura {
  id_estructura: number;
  entidad_id: number;
  nombre_estructura: string;
  codigo_centro_costo: string | null;  // Permitir null
  activo: boolean;
  // Opcional: fecha de creación
  creado_en?: string;
}

export interface EstructuraDetalle {
  id_estructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string | null;
  entidad: Entidad;
  areas: Area[];
  personas: PersonaResumen[];
  expedientes: {
    id_expediente: number;
    numero_expediente: string;
    fecha_creacion: string | null;
    estado: string | null;
    dictamenes: DictamenDetalle[] | null;                // <--- usa el más completo
    movimientos: MovimientoAFTDetalle[] | null;          // <--- usa el más completo
    informes_resumen: InformeResumenDetalle[] | null;    // <--- usa el más completo
  }[];

}

export interface EstructuraDetalle_Dic_Mov_Inf {
  id_estructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string | null;
  entidad: Entidad;
  areas: Area[];
  personas: PersonaResumen[];
  expedientes: ExpedienteDetalle_2[];
  total_expedientes: number;
}


export interface Estructura_Areas_Personas1 {
  id_estructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string | null;
  entidad: {
    id_entidad: number;
    nombre_entidad: string;
    descripcion: string;
  },
  areas: {
    id_area: number;
    codigo_area: string;
    nombre_area: string;
  }[],
  personas: {
    id_persona: number;
    solapin: string;
    nombre: string;
    apellidos: string;
    correo: string;
    estructura_id: number;
    cargo: {
      id_cargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    }
  }[];
  total_expedientes: number;
}

export interface EstructuraPlano {
  id_estructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string | null;
  entidad_id: number;
  nombre_entidad: string;
  descripcion: string;
}


export interface EditableCellEstructura {
  id: number;
  field: keyof Estructura;
  value: string;
}


export interface Estructura_Areas_Personas extends Estructura {
  areas?: Area[];
  personas?: Persona[];
}