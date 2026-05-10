import { UsuarioConPersona } from "./usuario";

export interface Rol {
    id_rol: number | string;
    nombre_rol: string;
    descripcion: string;
    //created_by: number | string;
}

export interface RolConUsuarios {
  id_rol: number | string;
  nombre_rol: string;
  descripcion: string;
  usuarios: UsuarioConPersona[];
}

export interface EditableCellRol {
  id: number;
  field: keyof RolConUsuarios;
  value: string;
}


export interface IRole {
  id_rol: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  total_permisos?: number;
  usuarios_count?: number;
}

export interface ICreateRoleDTO {
  nombre: string;
  descripcion: string;
}

export interface IPermiso {
  id_permiso: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  asignado?: boolean;
}