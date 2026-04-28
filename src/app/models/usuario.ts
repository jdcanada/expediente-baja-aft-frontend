import { Directivo } from "./directivo";

export interface User {
  id: number;
  username: string;
  token: string;
}


export interface Usuario {
  idusuario?: number;
  nombre_usuario?: string;
  password_hash?: string;
  foto?: string; 
  
  // Datos de persona
  persona_id?: number | string;
  solapin?: string;
  nombre?: string;
  apellidos?: string;
  correo?: string;

  // Datos del cargo
  cargo_id?: number | string;
  nombre_cargo?: string;
  es_directivo?: boolean;


  // Datos de estructura
  idestructura?: number | string;
  nombre_estructura?: string;
  codigo_centro_costo?: string;

  // Datos del rol
  id_rol?: number | string;
  nombre_rol?: string;
  descripcion?: string;
}

export interface UsuarioConDirectivo extends Usuario{
   directivo: Directivo | null;
}



export interface UsuarioConPersona {
  idusuario: number;
  nombre_usuario: string;
  id_rol: number;
  nombre_rol: string;
  persona: {
    idpersona: number;
    solapin: string;
    nombre: string;
    apellidos: string;
    correo: string | null;
    cargo: {
      idcargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    }

    estructura: {
      idestructura: number;
      nombre_estructura: string;
      codigo_centro_costo: number;
    }
  } | null;
}


interface UsuarioDetalle {
  idusuario: number;
  nombre_usuario: string;
  id_rol: number;
  nombre_rol: string;
  persona: {
    idpersona: number;
    nombre: string;
    apellidos: string;
    correo?: string | null;
    cargo: {
      idcargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    };
    area: {
      idarea: number;
      nombre_area: string;
      codigo_area: string;
    };
    estructura: {
      idestructura: number;
      nombre_estructura: string;
      codigo_centro_costo: string;
    };
  };
}

export interface EditableCellUsuario {
  id: number;
  field: 'nombre_usuario'; // puedes expandir si permites edición inline de más campos simples
  value: string;
}

