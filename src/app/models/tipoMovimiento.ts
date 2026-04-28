import { Area } from "./area";
import { MovimientoAFT } from "./movimientoaft";
import { Persona } from "./persona";

export interface TipoMovimiento {
  idtipo: number;
  descripcion: string;
}


export interface TipoMovimientoConDetalles {
  idtipo: number;
  descripcion: string;

  movimientos: MovimientoAFT[];
  areas: Area[];
  personas: Persona[];
}


export interface EditableCellTipoMovimiento {
  id: number;
  field: keyof TipoMovimiento;
  value: string;
}
