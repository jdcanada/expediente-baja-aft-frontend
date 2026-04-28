import { AFTRegistro } from "./aftregistro";
import { DictamenTecnico } from "./dictamentecnico";


export interface ExpedienteFormulario2 {
no_expediente: string;
fecha_creacion: string;
estado: boolean;
estructura_id: number;
}

// Modelo unificado para todo el expediente, dictámenes, informe y movimiento
export interface ExpedienteFormulario {
  // --- Datos generales ---
  no_expediente: string;
  fecha_creacion: string;
  estructura: string;
  estructura_id?: number;
  centroCostoCodigo: string;
  centroCostoNombre: string;
  direccionSolicita: string;
  areaEntrega: string;
  areaRecibe: string;
  fechaActa: string;
  horaActa: string;
  telefono: string;

  // Solicitante 

  nombreSolicitante: string;
  cargoSolicitante: string;

  // Hecho 
  hecho_por_id?: number;
  hechoPorNombre?: string;
  hechoPorCargo?: string;

  //Autorizado
  autorizado_por_id: number;
  autorizadoPorNombre?: string;
  autorizadoPorCargo?: string;
  
  //Aprobado
  aprobado_por_id: number;
  aprobadoPorNombre?: string;
  aprobadoPorCargo?: string;

  //Comision
  jefecomsion_id?: number;
  jefeComision: string;
  miembro1?: string;
  miembro2?: string;
  miembro3?: string;

  // Jefe que aprueba
  nombreJefeAprueba: string;
  cargoJefeAprueba: string;

  // --- Datos del medio/AFT (del Excel) ---
  area: string;                // Área del AFT
  codigoArea: string;          // Código del área
  descripcionAFT: string;      // Descripción/nombre del AFT
  inventarioNo: string;        // Número de inventario
  cnmb?: string;
  alquiler?: string;
  alquilerMonto?: string;
  tiempoD?: string;
  tiempoM?: string;
  tiempoA?: string;
  subCuenta?: string;
  valor?: string;

  // --- Materia Primas y firmas ---
  firmaMateriaPrimas?: string;

  // --- Movimiento: checkboxes ---
  compraNuevo?: boolean;
  compraUso?: boolean;
  traspasoRecibido?: boolean;
  ajusteInvAlta?: boolean;
  venta?: boolean;
  retiro?: boolean;
  perdida?: boolean;
  traspasoEfectuado?: boolean;
  ajusteInvBaja?: boolean;
  enviadoReparar?: boolean;
  trasladoInterno?: boolean;
  activoOcioso?: boolean;
  otrosActivos?: boolean;

  // --- Fundamentación y baja ---
  fundamentacionOperacion?: string;
  propuestoBaja?: boolean;

  // --- Informe técnico y firmas ---
  nombreTecnico?: string;
  cargoTecnico?: string;
  firmaTecnico?: string;

  hechoNombre?: string;
  hechoD?: string;
  hechoM?: string;
  hechoA?: string;

  aprobadoNombre?: string;
  aprobadoD?: string;
  aprobadoM?: string;
  aprobadoA?: string;
  aprobadoCargo?: string;
  aprobadoFirma?: string;

  autorizadoNombre?: string;
  autorizadoD?: string;
  autorizadoM?: string;
  autorizadoA?: string;
  autorizadoCargo?: string;
  autorizadoFirma?: string;

  transportadorNombre?: string;
  transportadorD?: string;
  transportadorM?: string;
  transportadorA?: string;
  transportadorCargo?: string;
  transportadorFirma?: string;

  anotando?: string;
  anotandoD?: string;
  anotandoM?: string;
  anotandoA?: string;
  no1?: string;
  no2?: string;

  // --- Dictámenes técnicos (pueden ser varios) ---
  dictamenes?: DictamenTecnico[];

  // Relación con los AFT (medios básicos) del Excel
  afts: AFTRegistro[];

  // --- Otros campos específicos de dictamen/informe ---
  dictamenResultado?: string;
  dictamenObservaciones?: string;
  // ...agrega aquí cualquier otro campo que uses en dictamen/informe...

  // --- Puedes agregar más campos según evolucione el flujo ---

}
