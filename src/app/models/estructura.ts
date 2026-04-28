import { Area } from "./area";
import { DictamenDetalle, DictamenResumen } from "./dictamen";
import { Entidad } from "./entidad";
import { ExpedienteDetalle_2 } from "./expediente";
import { InformeResumenDetalle } from "./informeResumen";
import { MovimientoAFTDetalle } from "./movimientoaft";
import { PersonaResumen } from "./persona";

export interface Estructura {
  idestructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string;
  entidad_id: number;
}

export interface EstructuraDetalle {
  idestructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string;
  entidad: Entidad;
  areas: Area[];
  personas: PersonaResumen[];
  expedientes: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string | null;
    estado: string | null;
    dictamenes: DictamenDetalle[] | null;                // <--- usa el más completo
    movimientos: MovimientoAFTDetalle[] | null;          // <--- usa el más completo
    informes_resumen: InformeResumenDetalle[] | null;    // <--- usa el más completo
  }[];

}

export interface EstructuraDetalle_Dic_Mov_Inf {
  idestructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string;
  entidad: Entidad;
  areas: Area[];
  personas: PersonaResumen[];
  expedientes: ExpedienteDetalle_2[];
  total_expedientes: number;
}


export interface Estructura_Areas_Personas {
  idestructura: number;
  nombre_estructura: string;
  codigo_centro_costo: string;
  entidad: {
    identidad: number;
    nombre_entidad: string;
    descripcion: string;
  },
  areas: {
    idarea: number;
    codigo_area: string;
    nombre_area: string;
  }[],
  personas: {
    idpersona: number;
    solapin: string;
    nombre: string;
    apellidos: string;
    correo: string;
    estructura_id: number;
    cargo: {
      idcargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    }
  }[];
  total_expedientes: number;
}

export interface EstructuraPlano {
  idestructura: number;
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
