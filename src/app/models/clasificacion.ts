export interface Clasificacion {
  id_clasificacion: number;
  descripcion: string;
}


import { MediobasicoDetalle } from './medioBasico';
import { Dictamen, DictamenDetalle } from './dictamen';

export interface ClasificacionDetalle {
  id_clasificacion: number;
  descripcion: string;
  mediobasicos: MediobasicoDetalle[];
  dictamenes: DictamenDetalle[];
}


export interface EditableCellClasificacion {
  id: number;
  field: keyof Clasificacion;
  value: string;
}

