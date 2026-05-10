// models/GrupoComision.ts

import { Comision } from "./comision";
import { ComisionMiembro, ComisionMiembro_Persona, ComisionMiembroDetalle } from "./comisionMiembro";
import { PersonaDetalle } from "./persona";

export interface GrupoComision {
  id_grupo: number;
  comision_id: number;
  nombre_grupo: string;
  descripcion: string;
  comision_nombre?: string;
  miembros?: any[];
}


export interface MiembroGrupo {
  nombre: string;
  apellidos: string;
  id_miembro: number;
  comision_id: number;
  grupo_id: number;
  persona_id: number;
  es_responsable: boolean;
  persona?: {
    id_persona: number;
    nombre: string;
    apellidos: string;
    correo: string;
  };
}

export interface GrupoComision_Simple extends GrupoComision {
    nombre_comision: string;

}

export interface GrupoComisionListItem {
    id_grupo: number;
    nombre_grupo: string;
}

export interface GrupoComisionDetalle extends GrupoComision {
    nombre_comision: string;
    miembros: GrupoComisionMiembroDetalle[];
}

export interface GrupoComisionMiembroDetalle {
    id_comisionmiembro: number;
    es_responsable: boolean;
    persona: PersonaDetalle;

}

export interface GrupoComision2 {
  id_grupo: number;
  nombre_grupo: string;
  descripcion: string | null;
  comision: Comision;
  miembros: ComisionMiembro_Persona[];
}

export interface EditableCellGrupoComision {
  id: number;
  field: keyof GrupoComision;
  value: string;
}
