// Interfaces de tipos
export interface Caracteristica {
  idcaracteristica: number;
  descripcion_c: string;
}

import { MediobasicoDetalle } from './medioBasico';
import { DictamenDetalle } from './dictamen';

export interface CaracteristicaDetalle {
  idcaracteristica: number;
  descripcion_c: string;
  mediobasicos: MediobasicoDetalle[];
  dictamenes: DictamenDetalle[];
}
