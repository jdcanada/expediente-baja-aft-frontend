// Interfaces de tipos
export interface Caracteristica {
  id_caracteristica: number;
  descripcion: string;
}

import { MediobasicoDetalle } from './medioBasico';
import { DictamenDetalle } from './dictamen';

export interface CaracteristicaDetalle {
  id_caracteristica: number;
  descripcion_c: string;
  mediobasicos: MediobasicoDetalle[];
  dictamenes: DictamenDetalle[];
}
