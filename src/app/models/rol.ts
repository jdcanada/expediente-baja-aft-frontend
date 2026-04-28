import { UsuarioConPersona } from "./usuario";

export interface Rol {
    idrol: number | string;
    nombre_rol: string;
    descripcion: string;
    //created_by: number | string;
}

export interface RolConUsuarios {
  idrol: number | string;
  nombre_rol: string;
  descripcion: string;
  usuarios: UsuarioConPersona[];
}

export interface EditableCellRol {
  id: number;
  field: keyof RolConUsuarios;
  value: string;
}