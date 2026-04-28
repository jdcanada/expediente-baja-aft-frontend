export interface Cargo {
  idcargo: number;
  nombre_cargo: string;
  es_directivo: boolean;
}


import { PersonaDetalle } from './persona';

export interface CargoDetalle {
  idcargo: number;
  nombre_cargo: string;
  es_directivo: boolean;
  personas: PersonaDetalle[];
}

export interface EditableCellCargo {
  id: number;
  field: keyof Cargo;
  value: string | boolean;
}

