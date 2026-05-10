export interface Cargo {
  id_cargo: number;
  nombre_cargo: string;
  es_directivo: boolean;
  activo: boolean;
}


import { PersonaDetalle } from './persona';

export interface CargoDetalle {
  id_cargo: number;
  nombre_cargo: string;
  es_directivo: boolean;
  personas: PersonaDetalle[];
}

export interface EditableCellCargo {
  id: number;
  field: keyof Cargo;
  value: string | boolean;
}

