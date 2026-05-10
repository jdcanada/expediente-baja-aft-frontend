// =====================================================
// INTERFAZ PARA ENVIAR AL BACKEND (POSTGRESQL)
// =====================================================

export interface ExpedienteBackend {
  // Campos que coinciden con la tabla expedientes
  numero_expediente: string;
  fecha_creacion: string;
  estructura_id: number;
  area_id: number;
  directivo_solicita_id: number;
  autorizado_por_id: number;
  aprobado_por_id: number;
  jefe_comision_id: number;
  causas_generales: string;
  creado_por_id: number;
  
  // Arrays de datos
  medios_baja: MedioBackend[];
  movimientos_agrupados?: MovimientoBackend[];
}

export interface MedioBackend {
  no_inventario: string;
  aft: string;
  area_id: number;
  caracteristica_id: number;
  clasificacion_id: number;
  argumentacion_tecnica: string;
  destino_final_id: number;
  orden?: number;
}

export interface MovimientoBackend {
  clasificacion_id: number;
  area_id: number;
  lista_inventarios: string[];
  cantidad: number;
  tipo_movimiento_id: number;
  entidad_destino?: string;
  fundamentacion?: string;
}