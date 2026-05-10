import { Estructura, EstructuraDetalle } from './estructura';
import { PersonaDetalle } from './persona';
import {  ExpedienteDetalle_2 } from './expediente';
import { MediobasicoDetalle } from './medioBasico';

export interface Area {
  id_area?: number;
  codigo_area: string;
  nombre_area: string;
  estructura_id?: number;
}

export interface AreaDetalle {
  id_area: number;
  codigo_area: string;
  nombre_area: string;
  estructura: EstructuraDetalle;
  personas: PersonaDetalle[];
  expedientes: ExpedienteDetalle_2[];
  mediobasicos: MediobasicoDetalle[];
}

export interface AreaDetalleSimple {
  id_area: number;
  codigo_area: string;
  nombre_area: string;
  estructura: Estructura;
  nombre_entidad: string;

}

export interface AreaPlano {
  id_area: number;
  codigo_area: string;
  nombre_area: string;
  estructura_id: number;
  estructura_nombre: string;
  estructura_codigo_centro_costo: string;
}




//codigo de bolt
export interface AreaDetalleSimple_bolt {
  id_area: number;
  codigo_area: string;
  nombre_area: string;
  nombre_estructura: string;
  codigo_centro_costo: string;
  nombre_entidad: string;
}

export interface AreaCreateRequest {
  codigo_area: string;
  nombre_area: string;
  nombre_estructura: string;
  codigo_centro_costo: string;
  nombre_entidad: string;
}

export interface AreaUpdateRequest extends Partial<AreaCreateRequest> {
  id_area: number;
}


export interface EditableCellArea {
  id: number;
  field: keyof AreaDetalleSimple_bolt;
  value: string;
}

