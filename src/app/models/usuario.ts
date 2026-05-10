import { Directivo } from "./directivo";

export interface User {
  id: number;
  username: string;
  token: string;
}


export interface Usuario {
  id_usuario?: number;
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
  id_estructura?: number | string;
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
  id_usuario: number;
  nombre_usuario: string;
  id_rol: number;
  nombre_rol: string;
  persona: {
    id_persona: number;
    solapin: string;
    nombre: string;
    apellidos: string;
    correo: string | null;
    cargo: {
      id_cargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    }

    estructura: {
      id_estructura: number;
      nombre_estructura: string;
      codigo_centro_costo: number;
    }
  } | null;
}


interface UsuarioDetalle {
  id_usuario: number;
  nombre_usuario: string;
  id_rol: number;
  nombre_rol: string;
  persona: {
    id_persona: number;
    nombre: string;
    apellidos: string;
    correo?: string | null;
    cargo: {
      id_cargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    };
    area: {
      id_area: number;
      nombre_area: string;
      codigo_area: string;
    };
    estructura: {
      id_estructura: number;
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


export interface UserData {
  
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  nombre_rol: string;
  id_rol?: string | number;
   id_persona: number;
  theme_preference?: 'dark' | 'light';
  persona?: {
    id_persona: number;
    nombre: string;
    apellidos: string;
    nombre_completo?: string;
    correo?: string;
    foto?: string;
    cargo?: {
      id_cargo: number;
      nombre_cargo: string;
      es_directivo: boolean;
    };
    estrutura?: {
      id_estructura: number;
      nombre_estructura: string;
      codigo_centro_costo: string;
    };
  };
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

