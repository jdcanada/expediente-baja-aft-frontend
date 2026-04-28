
import { PersonaDetalle } from './persona';
import { Comision, ComisionDetalle } from './comision';
import { DictamenDetalle } from './dictamen';
import { ExpedienteDetalle } from './expediente';
import { MediobasicoDetalle } from './medioBasico';


export interface ComisionMiembro {
  idcomisionmiembro: number;
  comision_id: number;
  persona_id: number;
  es_responsable: boolean;
}

export interface ComisionMiembro_Persona {
  idcomisionmiembro: number;
  es_responsable: boolean;
  persona: {
    idpersona: number;
    nombre: string;
    apellidos: string;
    correo: string;
    cargo: {
      idcargo: number;
      nombre_cargo: string;
      es_directivo: boolean
    }
  }
}

export interface JefeComision {
  idcomisionmiembro: number;
  es_responsable: boolean;
  grupo: {
    idgrupo: number;
    nombre_grupo: string;
    descripcion: string | null;
  };
  comision: {
    idcomision: number;
    nombre_comision: string;
  };
  persona: {
    idpersona: number;
    nombre: string;
    apellidos: string;
    correo: string;
    cargo: {
      idcargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    };
  };
}


export interface ComisionMiembroDetalle {
  idcomisionmiembro: number;
  comision_id: number;
  persona_id: number;
  es_responsable: boolean;
  grupo_id: number;

  // Objeto persona completo, con cargo, estructura, entidad, usuario, etc.
  persona: PersonaDetalle;

  // Dictámenes en los que este miembro participó (por su persona_id)
  dictamenes?: DictamenDetalle[];

  // Expedientes asociados a dictámenes donde participó este miembro
  expedientes?: ExpedienteDetalle[];

  // Medios básicos asociados a esos dictámenes (si quieres incluirlos)
  mediobasicos?: MediobasicoDetalle[];

  // Puedes agregar más relaciones en el futuro:
  // movimientos?: MovimientoAFTDetalle[];
  // informesResumen?: InformeResumenDetalle[];
}

export interface ComisionMiembroDetallePersona {
  idcomisionmiembro: number;
  comision_id: number;
  persona_id: number;
  es_responsable: boolean;

  // Objeto persona completo, con cargo, estructura, entidad, usuario, etc.
  persona: PersonaDetalle;

}

export interface ComisionMiembroPlano {
  idcomisionmiembro: number;
  comision_id: number;
  persona_id: number;
  es_responsable: number; // o boolean, según tu preferencia
  grupo_id: number | null;

  // Datos de la comisión
  comision_nombre: string;

  // Datos de la persona
  persona_nombre: string;
  persona_apellidos: string;
  persona_correo: string;
  persona_cargo_id: number;
  persona_estructura_id: number;

  // Datos del cargo de la persona
  cargo_nombre: string;
  cargo_es_directivo: number; // o boolean

  // Datos de la estructura de la persona
  estructura_nombre: string;
  estructura_codigo_centro_costo: string;
  estructura_entidad_id: number;

  // Datos de la entidad de la estructura
  entidad_nombre: string;
  entidad_descripcion: string;

  // Datos del grupo
  grupo_nombre: string;
  grupo_descripcion: string;
}

export interface EditableCellComisionMiembro {
  id: number;
  field: 'es_responsable';
  value: any;
}



