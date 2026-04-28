// models/GrupoComision.ts

import { Comision } from "./comision";
import { ComisionMiembro, ComisionMiembro_Persona, ComisionMiembroDetalle } from "./comisionMiembro";
import { PersonaDetalle } from "./persona";

export interface GrupoComision {
    idgrupo: number;
    comision_id: number;
    nombre_grupo: string;
    descripcion: string | null;
}

export interface GrupoComision_Simple extends GrupoComision {
    nombre_comision: string;

}

export interface GrupoComisionListItem {
    idgrupo: number;
    nombre_grupo: string;
}

export interface GrupoComisionDetalle extends GrupoComision {
    nombre_comision: string;
    miembros: GrupoComisionMiembroDetalle[];
}

export interface GrupoComisionMiembroDetalle {
    idcomisionmiembro: number;
    es_responsable: boolean;
    persona: PersonaDetalle;

}

export interface GrupoComision2 {
  idgrupo: number;
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
