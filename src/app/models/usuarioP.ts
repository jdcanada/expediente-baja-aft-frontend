import { Directivo } from "./directivo";

export interface UsuarioP {
  id?: number | string;
  nombre_usuario: string;
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
  
    // Datos del área
    area_id?: number | string;
    codigo_area?: string;
    nombre_area?: string;
  
    // Datos de estructura
    id_estructura?: number | string;
    nombre_estructura?: string;
    codigo_centro_costo?: string;
  
    // Datos del rol
    id_rol?: number | string;
    nombre_rol?: string;
    descripcion?: string;
  }
  
  export interface UsuarioConDirectivo extends UsuarioP{
     directivo: Directivo | null;
  }
  
  
  
  export interface UsuarioConPersona {
    id_usuario: number;
    nombre_usuario: string;
    persona: {
      id_persona: number;
      nombre: string;
      apellidos: string;
      correo: string | null;
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