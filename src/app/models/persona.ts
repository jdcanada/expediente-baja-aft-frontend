import { Cargo } from "./cargo";
import { Estructura } from "./estructura";

export interface Persona {
  idpersona: number;
  solapin: string;
  nombre: string;
  apellidos: string;
  correo?: string | null;
  cargo_id?: number | null;
  estructura_id?: number | null;
}

export interface PersonaPlano {
  idpersona: number;
  nombre: string;
  apellidos: string;
  correo: string;
  cargo_id: number;
  estructura_id: number;

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
  idpersona: number;
  solapin: string | null;
  nombre: string;
  apellidos: string;
  correo: string;
  cargo_id: number;
  nombre_cargo: string;
  es_directivo: number; // o boolean si prefieres mapearlo
  estructura_id: number;
  nombre_estructura: string;
  codigo_centro_costo: string;
}



export interface PersonaListItem {
  idpersona: number;
  solapin: string | null;
  nombre: string;
  apellidos: string;
  correo: string;
  cargo_id: number;
  nombre_cargo: string;
  es_directivo: number; // o boolean, si prefieres mapearlo
  estructura_id: number;
  nombre_estructura: string;
  codigo_centro_costo: string;
}

export interface PersonaListItem2 extends PersonaListItem {
iddirectivo: number;
persona_id: number;
telefono_corporativo: string;
}

export interface PersonaDetalle {
  idpersona: number;
  solapin: string;
  nombre: string;
  apellidos: string;
  correo: string | null;
  cargo?: Cargo | null;
  estructura?: Estructura | null;
  usuario?: {
    idusuario: number;
    nombre_usuario: string;
    id_rol: number;
  } | null;
  directivo?: {
    iddirectivo: number;
    telefono_corporativo: string | null;
  } | null;
  comisiones?: Array<{
    idcomisionmiembro: number;
    idcomision: number;
    nombre_comision: string;
    descripcion: string | null;
    es_responsable: boolean;
  }>;
}


export interface PersonaResumen {
  idpersona: number;
  solapin: string;
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


