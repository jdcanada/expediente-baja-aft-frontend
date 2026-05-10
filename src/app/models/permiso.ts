export interface IPermiso {
  id_permiso: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  activo: boolean;
  asignado?: boolean;
}

export interface IPermisoPorModulo {
  modulo: string;
  permisos: IPermiso[];
}

export interface IAsignarPermisoDTO {
  rolId: number;
  permisoId: number;
}

export interface ICreatePermisoDTO {
  codigo: string;
  nombre: string;
  descripcion: string;
  modulo: string;
}


export interface PermisoItem {
  id_permiso: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  modulo: string;
  asignado?: boolean;
}

export interface TarjetaPermiso {
  nombre: string;
  icono: string;
  descripcion: string;
  modulo: string;
  permisos: PermisoItem[];
}