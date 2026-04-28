export interface Clasificacion {
  idclasificacion: number;
  descripcion: string;
}


import { MediobasicoDetalle } from './medioBasico';
import { Dictamen, DictamenDetalle } from './dictamen';

export interface ClasificacionDetalle {
  idclasificacion: number;
  descripcion: string;
  mediobasicos: MediobasicoDetalle[];
  dictamenes: DictamenDetalle[];
}


export interface EditableCellClasificacion {
  id: number;
  field: keyof Clasificacion;
  value: string;
}

