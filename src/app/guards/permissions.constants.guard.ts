/**
 * REFERENCIAS DE PERMISOS - Solo para mantener consistencia en las rutas
 * Estos permisos DEBEN existir en la base de datos en la tabla 'permisos'
 * La lógica de asignación está en el backend
 * 
 * ACTUALIZADO: Sincronizado con la base de datos el 05/05/2026
 */

export const PERMISSIONS = {
  // ============================================
  // EXPEDIENTES
  // ============================================
  EXPEDIENTES_VER: 'expedientes.ver',
  EXPEDIENTES_CREAR: 'expedientes.crear',
  EXPEDIENTES_EDITAR: 'expedientes.editar',
  EXPEDIENTES_ELIMINAR: 'expedientes.eliminar',
  EXPEDIENTES_APROBAR: 'expedientes.aprobar',

  // ============================================
  // DICTÁMENES
  // ============================================
  DICTAMENES_VER: 'dictamenes.ver',
  DICTAMENES_CREAR: 'dictamenes.crear',
  DICTAMENES_EDITAR: 'dictamenes.editar',
  DICTAMENES_ELIMINAR: 'dictamenes.eliminar',

  // ============================================
  // MOVIMIENTOS
  // ============================================
  MOVIMIENTOS_VER: 'movimientos.ver',
  MOVIMIENTOS_CREAR: 'movimientos.crear',
  MOVIMIENTOS_EDITAR: 'movimientos.editar',
  MOVIMIENTOS_ELIMINAR: 'movimientos.eliminar',

  // ============================================
  // REPORTES
  // ============================================
  REPORTES_VER: 'reportes.ver',
  REPORTES_EXPORTAR: 'reportes.exportar',

  // ============================================
  // CATÁLOGOS
  // ============================================
  CATALOGOS_VER: 'catalogos.ver',
  CATALOGOS_EDITAR: 'catalogos.editar',

  // Áreas
  AREAS_VER: 'areas.ver',
  AREAS_CREAR: 'areas.crear',
  AREAS_EDITAR: 'areas.editar',
  AREAS_ELIMINAR: 'areas.eliminar',

  // Estructuras
  ESTRUCTURAS_VER: 'estructuras.ver',
  ESTRUCTURAS_CREAR: 'estructuras.crear',
  ESTRUCTURAS_EDITAR: 'estructuras.editar',
  ESTRUCTURAS_ELIMINAR: 'estructuras.eliminar',

  // Personas
  PERSONAS_VER: 'personas.ver',
  PERSONAS_CREAR: 'personas.crear',
  PERSONAS_EDITAR: 'personas.editar',
  PERSONAS_ELIMINAR: 'personas.eliminar',

  // Cargos 🆕
  CARGOS_VER: 'cargos.ver',
  CARGOS_CREAR: 'cargos.crear',
  CARGOS_EDITAR: 'cargos.editar',
  CARGOS_ELIMINAR: 'cargos.eliminar',

  // Características 🆕
  CARACTERISTICAS_VER: 'caracteristicas.ver',
  CARACTERISTICAS_CREAR: 'caracteristicas.crear',
  CARACTERISTICAS_EDITAR: 'caracteristicas.editar',
  CARACTERISTICAS_ELIMINAR: 'caracteristicas.eliminar',

  // Clasificaciones 🆕
  CLASIFICACIONES_VER: 'clasificaciones.ver',
  CLASIFICACIONES_CREAR: 'clasificaciones.crear',
  CLASIFICACIONES_EDITAR: 'clasificaciones.editar',
  CLASIFICACIONES_ELIMINAR: 'clasificaciones.eliminar',

  // Entidades 🆕
  ENTIDADES_VER: 'entidades.ver',
  ENTIDADES_CREAR: 'entidades.crear',
  ENTIDADES_EDITAR: 'entidades.editar',
  ENTIDADES_ELIMINAR: 'entidades.eliminar',

  // Destinos Finales
  DESTINOS_FINALES_VER: 'destinos-finales.ver',
  DESTINOS_FINALES_CREAR: 'destinos-finales.crear',
  DESTINOS_FINALES_EDITAR: 'destinos-finales.editar',
  DESTINOS_FINALES_ELIMINAR: 'destinos-finales.eliminar',

  // Tipos Movimiento
  TIPOS_MOVIMIENTO_VER: 'tipos-movimiento.ver',
  TIPOS_MOVIMIENTO_CREAR: 'tipos-movimiento.crear',
  TIPOS_MOVIMIENTO_EDITAR: 'tipos-movimiento.editar',
  TIPOS_MOVIMIENTO_ELIMINAR: 'tipos-movimiento.eliminar',

  // ============================================
  // COMISIONES
  // ============================================
  COMISIONES_VER: 'comisiones.ver',
  COMISIONES_CREAR: 'comisiones.crear',
  COMISIONES_EDITAR: 'comisiones.editar',
  COMISIONES_ELIMINAR: 'comisiones.eliminar',

  // Grupos Comisión
  GRUPOS_COMISION_VER: 'grupos-comision.ver',
  GRUPOS_COMISION_CREAR: 'grupos-comision.crear',
  GRUPOS_COMISION_EDITAR: 'grupos-comision.editar',
  GRUPOS_COMISION_ELIMINAR: 'grupos-comision.eliminar',

  // ============================================
  // MEDIOS BÁSICOS
  // ============================================
  MEDIOS_BAJA_VER: 'medios-baja.ver',
  MEDIOS_BAJA_CREAR: 'medios-baja.crear',
  MEDIOS_BAJA_EDITAR: 'medios-baja.editar',
  MEDIOS_BAJA_ELIMINAR: 'medios-baja.eliminar',

  // ============================================
  // USUARIOS Y SEGURIDAD
  // ============================================
  USUARIOS_VER: 'usuarios.ver',
  USUARIOS_CREAR: 'usuarios.crear',
  USUARIOS_EDITAR: 'usuarios.editar',
  USUARIOS_ELIMINAR: 'usuarios.eliminar',

  ROLES_VER: 'roles.ver',
  ROLES_ASIGNAR: 'roles.asignar',

  PERMISOS_VER: 'permisos.ver',
  PERMISOS_CREAR: 'permisos.crear',
  PERMISOS_EDITAR: 'permisos.editar',
  PERMISOS_ELIMINAR: 'permisos.eliminar',

  // ============================================
  // CONFIGURACIÓN
  // ============================================
  CONFIGURACION_VER: 'configuracion.ver',
  CONFIGURACION_EDITAR: 'configuracion.editar'
} as const;

// Tipo para TypeScript
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];