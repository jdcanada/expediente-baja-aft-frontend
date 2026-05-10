import { Cargo } from "./cargo";
import { Estructura } from "./estructura";

export interface Persona {
  id_persona: number;
  solapin: string| null;
  nombre: string;
  apellidos: string;
  correo?: string | null;
  cargo_id?: number | null;
  estructura_id?: number | null;
  telefono: string;
  activo: boolean
}

export interface PersonaPlano {
  id_persona: number;
  nombre: string;
  apellidos: string;
  correo: string;
  cargo_id: number;
  estructura_id: number | null;

  // Datos del cargo
  cargo_nombre: string;
  cargo_es_directivo: number; // o boolean, según tu preferencia

  // Datos de la estructura
  estructura_nombre: string;
  estructura_codigo_centro_costo: string;
  estructura_entidad_id: number;

  // Datos de la entidad asociada a la estructura
  entidad_nombre: string;
}


export interface PersonaById {
  id_persona: number;
  solapin: string | null;
  nombre: string;
  apellidos: string;
  correo: string;
  cargo_id: number;
  nombre_cargo: string;
  es_directivo: number; // o boolean si prefieres mapearlo
  estructura_id: number | null;
  nombre_estructura: string;
  codigo_centro_costo: string;
}



export interface PersonaListItem {
  id_persona: number;
  solapin: string | null;
  nombre: string;
  apellidos: string;
  correo: string;
  cargo_id: number;
  nombre_cargo: string;
  es_directivo: number; // o boolean, si prefieres mapearlo
  estructura_id: number | null;
  nombre_estructura: string;
  codigo_centro_costo: string;
}

export interface PersonaListItem2 extends PersonaListItem {
id_directivo: number;
persona_id: number;
telefono: string;
}

export interface PersonaDetalle {
  id_persona: number;
  solapin: string | null;
  nombre: string;
  apellidos: string;
  correo: string | null;
  cargo?: Cargo | null;
  estructura?: Estructura | null;
  usuario?: {
    id_usuario: number;
    nombre_usuario: string;
    id_rol: number;
  } | null;
  directivo?: {
    id_directivo: number;
    telefono_corporativo: string | null;
  } | null;
  comisiones?: Array<{
    id_miembro: number;
    idcomision: number;
    nombre_comision: string;
    descripcion: string | null;
    es_responsable: boolean;
  }>;
}


export interface PersonaResumen {
  id_persona: number;
  solapin: string | null;
  nombre: string;
  apellidos: string;
  correo: string | null;
  estructura_id: number | null;
  cargo: Cargo | null;
}


export interface EditableCellPersona{
   id: number;
  field: keyof PersonaListItem;
  value: string | boolean;
}


