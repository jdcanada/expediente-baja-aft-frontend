// =====================================================
// DICTAMEN - Interfaces alineadas con PostgreSQL
// =====================================================

import { ComisionMiembro, ComisionMiembro_Persona } from "./comisionMiembro";
import { Entidad } from "./entidad";
import { MediobasicoDetalle_Estructura, MedioBasicoResumen } from "./medioBasico";
import { PersonaResumen } from "./persona";

// Interfaz principal para CREAR/ACTUALIZAR un dictamen
// NOTA: NO tiene expediente_id directamente
export interface Dictamen {
  id_dictamen?: number;
  no_dictamen: string;
  medio_id: number;                    // ← ANTES era mediobasico_id
  comision_id: number;
  directivo_solicita_id: number;
  caracteristica_id?: number | null;
  argumentacion_tecnica?: string | null;
  destino_final_id?: number | null;    // ← ANTES era destino_final (string)
  destino_final?: string;
  concluye_reparable: boolean;         // ← ANTES era concluye_reparable
  fecha_dictamen?: string | null;
  estructura_solicita_id?: number | null;
  miembros_firmantes?: any;            // JSONB para los miembros que firman
}

// Interfaz para LISTAR dictámenes con datos relacionados
// Aquí SÍ podemos tener expediente_id (viene del JOIN)
export interface DictamenListado {
  id_dictamen: number;
  no_dictamen: string;
  argumentacion_tecnica: string;
  destino_final?: string;
  destino_final_id?: number | null;
  concluye_reparable: boolean;
  fecha_dictamen: string;
  expediente?: {
    id_expediente: number;
    numero_expediente: string;
    fecha_creacion: string;
    estado: string;
  };
  mediobasico?: {
    id_medio: number;
    no_inventario: string;
    aft: string;
    clasificacion?: { id_clasificacion: number; descripcion: string };
    area?: { id_area: number; nombre_area: string };
  };
  comision?: { id_comision: number; nombre_comision: string };
  directivo_solicita?: {
    id_persona: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    cargo?: { id_cargo: number; nombre_cargo: string };
  };
}

// Interfaz para DETALLE completo de un dictamen
export interface DictamenDetalle {
  id_dictamen: number;
  no_dictamen: string;
  argumentacion_tecnica: string | null;
  destino_final_id?: number | null;
  destino_final?: string;
  concluye_reparable: boolean;
  fecha_dictamen: string | null;
  miembros_firmantes: any;

  // Relaciones completas
  medio: {
    id_medio: number;
    no_inventario: string;
    aft: string;
    expediente_id: number;
    expediente?: {
      id_expediente: number;
      numero_expediente: string;
      fecha_creacion: string;
      estado: string;
    };
    area?: {
      id_area: number;
      nombre_area: string;
      codigo_area: string;
    };
    clasificacion?: {
      id_clasificacion: number;
      descripcion: string;
    };
    caracteristica?: {
      id_caracteristica: number;
      descripcion: string;
    };
  };

  comision: {
    id_comision: number;
    nombre_comision: string;
    miembros?: any[];
  };

  directivo_solicita: {
    id_persona: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    cargo?: {
      id_cargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    };
  };

  estructura_solicita?: {
    id_estructura: number;
    nombre_estructura: string;
    codigo_centro_costo: string;
  };
}


export interface DictamenDetalle_new{
  id_dictamen: number;
  no_dictamen: string;
  argumentacion_tecnica: string | null;
  destino_final?: string | null;
  destino_final_id?: number;
  concluye_reparable: boolean;
  fecha_dictamen: string;
  miembros_firmantes: any;

  expediente: {
    id_expediente: number;
    numero_expediente: string;
    fecha_creacion: string;
    estado: string;
  } | null;

  mediobasico: {
    id_medio: number;
    no_inventario: string;
    aft: string;
    clasificacion: {
      id_clasificacion: number;
      descripcion: string;
    } | null;
    caracteristica: {
      id_caracteristica: number;
      descripcion_c: string;
    } | null;
    area: {
      id_area: number;
      nombre_area: string;
      codigo_area: string;
    } | null;
  } | null;

  grupo: {
    id_grupo: number;
    nombre_grupo: string;
    comision_id: number;
    nombre_comision: string;
    comisionmiembros: {
      id_miembro: number;
      es_responsable: boolean;
      persona: {
        id_persona: number;
        nombre: string;
        apellidos: string;
        correo: string;
        cargo: {
          id_cargo: number;
          nombre_cargo: string;
          es_directivo: boolean;
        } | null;
      };
    }[];
  } | null;
}

// Interfaz para DICTAMEN RESÚMEN (usado en informes)
export interface DictamenResumen {
  id_dictamen: number;
  no_dictamen: string;
  fecha_dictamen: string | null;
  argumentacion_tecnica: string | null;
  destino_final?: string;
  destino_final_id?: number | null;
  concluye_reparable: boolean;
  medio: {
    id_medio: number;
    no_inventario: string;
    aft: string;
  };
}


export interface DictamenTecnico {
  consecutivo: number;          // NO.
  inventario: string;           // NO. INVENTARIO
  aft: string;                  // AFT
  area: string;                 // ÁREAS DE RESPONSABILIDAD
  noDictamen: string;           // NO. DICTAMEN
  fechaDictamen: string;        // Fecha del dictamen (puede venir del formulario o Excel)
  caracteristica: string;       // CARACTERÍSTICA
  observaciones: string;        // OBSERVACIONES
  clasificacion: string;        // CLASIFICACIÓN
  argumentacion: string;        // ARGUMENTACIÓN TÉCNICA
  destinoFinal?: string;        // Opcional
}


export interface DictamenPlano {
  id_dictamen: number;
  medio_id: number;
  caracteristica_id: number | null;
  estructura_solicita_id: number | null;
  comision_id: number | null;
  argumentacion_tecnica: string | null;
  destino_final: string | null;
  fecha_dictamen: string | null; // o Date si lo manejas así
  concluye_reparable: number; // o boolean

  // Estructura solicitante
  estructura_nombre: string;
  estructura_codigo_centro_costo: string;
  estructura_id: number;

  // Entidad asociada
  entidad_nombre: string;
  entidad_descripcion: string;
  entidad_id: number;

  // Medio básico
  mediobasico_no_inventario: string;
  mediobasico_aft: string;

  // Característica y clasificación del medio básico
  caracteristica_descripcion: string;
  clasificacion_descripcion: string;
  
}


export interface DictamenResumen2 {
  id_dictamen: number;
  no_dictamen?: string | null;
  argumentacion_tecnica: string;
  destino_final?: string | null;
  destino_final_id?: number | null;
  concluye_reparable: boolean;
  expediente_id: number;
  mediobasico_id: number;
  directivo_solicita_id: number | null;
  caracteristica_id: number | null;
  fecha_dictamen: string | null;
  estructura_solicita_id: number | null;
  comision_id: number | null;
  mediosbasico: MedioBasicoResumen; // <- este campo es requerido
}


export interface DictamenDetalle_3 {
  id_dictamen: number;
  argumentacion_tecnica: string | null;
  destino_final?: string ;
  destino_final_id?: number ;
  concluye_reparable: boolean;
  fecha_dictamen: string | null;
  mediobasico: MediobasicoDetalle_Estructura | null;
  directivo_solicita: {
    id_directivo: number;
    telefono_corporativo: string | null;
    persona: PersonaResumen | null;
  } | null;
  comision: { idcomision: number; nombre_comision: string } | null;
  expediente: {
    id_expediente: number;
    numero_expediente: string;
    fecha_creacion: string | null;
    estado: string | null;
  };
  estructura: {
    id_estructura: number;
    nombre_estructura: string;
    codigo_centro_costo: string;
  };
  entidad: Entidad;
}




export interface EditableCellDictamen {
  id: number;
  field: keyof DictamenListado;
  value: string;
}