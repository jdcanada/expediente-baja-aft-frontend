import { Mediobasico, MedioBasicoResumen } from "./medioBasico";
import { Persona, PersonaResumen } from "./persona";

export interface InformeResumen {
  idinforme?: number;
  expediente_id: number;
  fecha_informe: string;
  autorizado_por_id?: number | null;
  aprobado_por_id?: number | null;
  jefe_comision_id?: number | null;
  observaciones?: string | null;
}

export interface InformeResumenPlano {
  idinforme: number;
  expediente_id: number;
  fecha_informe: string; // o Date, según cómo lo manejes
  autorizado_por_id: number | null;
  aprobado_por_id: number | null;
  jefe_comision_id: number | null;
  observaciones: string | null;

  // Autorizado por
  autorizado_nombre: string | null;
  autorizado_apellidos: string | null;
  autorizado_idpersona: number | null;
  autorizado_correo: string | null;
  autorizado_estructura_id: number | null;
  autorizado_idcargo: number | null;
  autorizado_nombre_cargo: string | null;
  autorizado_es_directivo: number | boolean | null;

  // Aprobado por
  aprobado_nombre: string | null;
  aprobado_apellidos: string | null;
  aprobado_idpersona: number | null;
  aprobado_correo: string | null;
  aprobado_estructura_id: number | null;
  aprobado_idcargo: number | null;
  aprobado_nombre_cargo: string | null;
  aprobado_es_directivo: number | boolean | null;

  // Jefe de comisión (responsable del grupo)
  jefe_comision_idcomisionmiembro: number | null;
  jefe_nombre: string | null;
  jefe_apellidos: string | null;
  jefe_idpersona: number | null;
  jefe_correo: string | null;
  jefe_estructura_id: number | null;
  jefe_idcargo: number | null;
  jefe_nombre_cargo: string | null;
  jefe_es_directivo: number | boolean | null;
}


export interface InformeResumenDetalle2 {
  idinforme: number;
  fecha_informe: string;
  observaciones: string | null;
  autorizado_por: Persona | null;
  aprobado_por: Persona | null;
  jefe_comision: Persona | null;
  medios_basicos: Mediobasico[];
}

export interface InformeResumenDetalle3 {
  idinforme: number;
  fecha_informe: string;
  autorizado_por: PersonaResumen | null;
  aprobado_por: PersonaResumen | null;
  jefe_comision: {
    idcomisionmiembro: number;
    persona: PersonaResumen | null;
  } | null;
  observaciones: string | null;
  medios_basicos: MedioBasicoResumen[];
}






export interface InformeResumenDetalle {
  idinforme: number;
  expediente_id: number;
  fecha_informe: string;
  autorizado_por_id?: number | null;
  aprobado_por_id?: number | null;
  jefe_comision_id?: number | null;
  observaciones?: string | null;

  expediente: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string;
    estado: string;
    estructura_id: number;
  } | null;

  autorizado_por?: {
    idpersona: number;
    nombre: string;
    apellidos: string;
  } | null;

  aprobado_por?: {
    idpersona: number;
    nombre: string;
    apellidos: string;
  } | null;

  jefe_comision?: {
    idcomisionmiembro: number;
    persona: {
      idpersona: number;
      nombre: string;
      apellidos: string;
    };
  } | null;
}


// InformeResumen donde el directivo participó
export interface InformeResumenResumen {
  idinforme: number;
  expediente_id: number;
  fecha_informe: string;
  autorizado_por_id: number | null;
  aprobado_por_id: number | null;
  jefe_comision_id: number | null;
  observaciones: string | null;
  // Para saber el rol del directivo:
  es_autorizado_por: boolean;
  es_aprobado_por: boolean;
}

export interface InformeResumenEnriquecido {
  idinforme: number;
  fecha_informe: string;
  observaciones: string | null;
  expediente: { idexpediente: number; no_expediente: string } | null;
  autorizado_por: { idpersona: number; nombre: string; apellidos: string } | null;
  aprobado_por: { idpersona: number; nombre: string; apellidos: string } | null;
  es_autorizado_por: boolean;
  es_aprobado_por: boolean;
}






export interface InformeResumenCompleto {
  // Datos básicos
  idinforme: number;
  expediente_id: number;
  fecha_informe: string;
  observaciones: string | null;

  // Relación completa con expediente
  expediente: {
    idexpediente: number;
    no_expediente: string;
    fecha_creacion: string;
    estado: string;
    estructura_id: number;
  } | null;

  // Personas enriquecidas
  autorizado_por: Persona | null;
  aprobado_por: Persona | null;
  jefe_comision: Persona | null;

  // IDs para lógica interna (opcional)
  autorizado_por_id?: number | null;
  aprobado_por_id?: number | null;
  jefe_comision_id?: number | null;

  // Datos de roles (opcional)
  es_autorizado_por?: boolean;
  es_aprobado_por?: boolean;

  // Medios básicos asociados (CRÍTICO para informes)
  medios_basicos: MedioBasicoResumen[];
}

export interface EditableCellInformeResumen {
  id: number;
  field: keyof InformeResumenCompleto;
  value: string;
}


