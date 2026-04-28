export interface DictamenTecnico {
  consecutivo: number;          // NO.
  inventario: string;           // NO. INVENTARIO
  aft: string;                  // AFT
  area: string;                 // ÁREAS DE RESPONSABILIDAD
  noDictamen: string;           // NO. DICTAMEN
  fechaDictamen: string;        // Fecha del dictamen (puede venir del formulario o Excel)
  caracteristica: string;       // CARACTERÍSTICA
  observaciones: string;        // OBSERVACIONES
  clasificacion: string;        // CLASIFICACIÓN
  argumentacion: string;        // ARGUMENTACIÓN TÉCNICA
  destinoFinal?: string;        // Opcional
}

