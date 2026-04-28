// models/directivo.ts

export interface Directivo {
  iddirectivo: number;
  persona_id: number;
  telefono_corporativo: string | null;
}


// models/directivo.ts

import { Persona } from './persona';
import { Estructura } from './estructura';
import { Cargo } from './cargo';
import { DictamenResumen } from './dictamen';
import { InformeResumenResumen } from './informeResumen';
import { MovimientoAFTResumen } from './movimientoaft';
//import { Area } from './area';

export interface DirectivoDetalle {
  iddirectivo: number;
  telefono_corporativo: string | null;
  persona: Persona;
  estructura: Estructura;
  cargo: Cargo;
  
}

export interface DirectivoAccionesResponse {
  dictamenes: DictamenResumen[];
  movimientos: MovimientoAFTResumen[];
  informesResumen: InformeResumenResumen[];
}

export interface DirectivoPlano {
  iddirectivo: number;
  persona_id: number;
  telefono_corporativo: string | null;

  // Datos de la persona
  persona_nombre: string;
  persona_apellidos: string;
  persona_correo: string;

  // Cargo y estructura
  cargo_id: number;
  estructura_id: number;
  cargo_nombre: string;
  estructura_nombre: string;
}

export interface EditableCellDirectivo {
  id: number;
  field: keyof DirectivoDetalle;
  value: string;
}

