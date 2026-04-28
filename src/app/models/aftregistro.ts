export interface AFTRegistro {
  consecutivo: number;           // NO.
  mb: string;            // NO. INVENTARIO
  aft: string;                   // AFT
  area: string; 
  codigoArea?: string;                 // ÁREAS DE RESPONSABILIDAD
  noDictamen: string;            // NO. DICTAMEN
  caracteristica: string;        // CARACTERÍSTICA
  destinoFinal: string;          // DESTINO FINAL
  clasificacion: string;         // CLASIFICACIÓN
  argumentacion: string;         // ARGUMENTACIÓN TÉCNICA
  partesPiezas?: string;
  conclusionNoReparable?: boolean;
  fechaDia?: string;
  fechaMes?: string;
  fechaAno?: string;

}
