import { Component, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { AFTRegistro } from '../../models/aftregistro';
import { CommonModule } from '@angular/common';

const COLUMNAS_ESPERADAS = [
  'NO.',
  'NO. INVENTARIO',
  'AFT',
  'ÁREAS DE RESPONSABILIDAD',
  'NO. DICTAMEN',
  'CARACTERÍSTICA',
  'DESTINO FINAL',
  'CLASIFICACIÓN',
  'ARGUMENTACIÓN TÉCNICA'
];

function normalizarTexto(texto: string): string {
  return (texto || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}


@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrl: './upload-excel.component.css',
  standalone: true,
  imports: [
    CommonModule,
  ]
})



export class UploadExcelComponent {
  @Output() excelLoaded = new EventEmitter<AFTRegistro[]>();
  excelData: AFTRegistro[] = [];
  mensajeError: string = "";


  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) {
        this.mensajeError = 'No se pudo leer el archivo.';
        this.excelLoaded.emit([]);
        return;
      }

      const data = new Uint8Array(arrayBuffer as ArrayBuffer);
      const wb: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      if (jsonData.length === 0) {
        this.mensajeError = 'El archivo Excel está vacío.';
        this.excelLoaded.emit([]);
        return;
      }

      // Normalizar cabecera y columnas esperadas
      const cabecera = (jsonData[0] as string[]).map(normalizarTexto);
      const columnasEsperadas = COLUMNAS_ESPERADAS.map(normalizarTexto);

      // Validar cantidad de columnas
      if (cabecera.length !== columnasEsperadas.length) {
        this.mensajeError = `El archivo Excel debe tener exactamente ${columnasEsperadas.length} columnas.`;
        this.excelLoaded.emit([]);
        return;
      }

      // Validar orden y nombres exactos de columnas
      for (let i = 0; i < columnasEsperadas.length; i++) {
        if (cabecera[i] !== columnasEsperadas[i]) {
          const cabeceraRaw = jsonData[0] as (string | number | undefined)[];
          this.mensajeError = `Error en columna ${i + 1}: se esperaba "${COLUMNAS_ESPERADAS[i]}", pero se encontró "${cabeceraRaw[i]}".`;
          this.excelLoaded.emit([]);
          return;
        }
      }

      this.mensajeError = '';

      // Procesar registros si la validación pasa
      const registros: AFTRegistro[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        // Limpia espacios en blanco y valida que no esté vacío realmente
        const inventario = (row[1] || '').replace(/\s+/g, '').trim();
        if (!inventario) continue; // Ignora filas con NO. INVENTARIO vacío o solo espacios

        registros.push({
          consecutivo: Number(row[0]),
          mb: inventario, // Ya limpio
          aft: row[2] || '',
          area: row[3] || '',
          noDictamen: row[4] || '',
          caracteristica: row[5] || '',
          destinoFinal: row[6] || '',
          clasificacion: row[7] || '',
          argumentacion: row[8] || ''
        });
      }


      this.excelLoaded.emit(registros);
    };

    reader.readAsArrayBuffer(target.files[0]);
  }

  onFileSelected(event: any) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Normaliza todos los encabezados
      const cabecera = (jsonData[0] as string[]).map(x => normalizarTexto(x));
      console.log('Cabecera normalizada:', cabecera);

      // Normaliza las columnas esperadas
      const columnasEsperadasNormalizadas = COLUMNAS_ESPERADAS.map(normalizarTexto);

      // Verifica que todas las columnas esperadas estén presentes
      const columnasFaltantes = columnasEsperadasNormalizadas.filter(
        col => !cabecera.includes(col)
      );

      if (cabecera.length < 8 || columnasFaltantes.length > 0) {
        this.mensajeError = 'El archivo Excel no cumple con la estructura requerida. Faltan columnas: ' + columnasFaltantes.join(', ');
        this.excelData = [];
        return;
      }

      this.mensajeError = '';
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      this.excelLoaded.emit(this.excelData);
    };
    reader.readAsArrayBuffer(file);
  }





}
