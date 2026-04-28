import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { AFTRegistro } from '../../models/aftregistro';
import { ExpedienteFormulario } from '../../models/expedienteformulario';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator';
import { AftTableEditComponent } from "../aft-table-edit/aft-table-edit.component";
import { ExpedienteFormComponent } from "../expediente/expediente-form/expediente-form.component";
import { UploadExcelComponent } from "../upload-excel/upload-excel.component";
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { DocumentPreviewComponent } from '../document-preview/document-preview.component';
import { Mediobasico, MedioBasicoDictamenMasivo } from '../../models/medioBasico';
import { MediobasicoService } from '../../services/mediobasico/mediobasico.service';
import { Dictamen } from '../../models/dictamen';
import { DictamenService } from '../../services/dictamen/dictamen.service';
import { AreaService } from '../../services/area/area.service';
import { CaracteristicaService } from '../../services/caracteristica/caracteristica.service';
import { ClasificacionService } from '../../services/clasificacion/clasificacion.service';
import { ExpedienteService } from '../../services/expediente/expediente.service';
import { InformeresumenService } from '../../services/informeresumen/informeresumen.service';
import { ComisionmiembrosService } from '../../services/comisionmiembros/comisionmiembros.service';
import { ComisionMiembroDetalle } from '../../models/comisionMiembro';
import { Area, AreaDetalleSimple } from '../../models/area';
import { Expediente } from '../../models/expediente';
import { InformeResumen } from '../../models/informeResumen';
import { Estructura } from '../../models/estructura';
import { EstructuraService } from '../../services/estructura/estructura.service';
import { MovimientoaftService } from '../../services/movimientoaft/movimientoaft.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NotificacionService } from '../../services/notificacion/notificacion.service';


@Component({
  standalone: true,
  selector: 'app-wizard-expediente',
  templateUrl: './wizard-expediente.component.html',
  styleUrls: ['./wizard-expediente.component.css'],
  imports: [
    CommonModule,
    DocumentPreviewComponent,
    AftTableEditComponent,
    ExpedienteFormComponent,
    UploadExcelComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    RouterModule,


  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WizardExpedienteComponent {
  steps = [
    { label: 'Cargar Excel' },
    { label: 'Datos Generales' },
    { label: 'Editar Registros' },
    { label: 'Descargar Dictámenes' },
    { label: 'Descargar Movimientos AFT' },
    { label: 'Descargar Informe Resumen' }
  ];

  currentStep = 0;

  excelData: AFTRegistro[] = [];
  miembrosComision: ComisionMiembroDetalle[] = [];
  areas: Area[] = [];
  caracteristicas: { idcaracteristica: number, descripcion_c: string }[] = [];
  clasificaciones: { idclasificacion: number, descripcion: string }[] = [];
  estructuras: Estructura[] = [];
  movimientosMap: Map<AFTRegistro, number> = new Map();
  idexpediente: number = 0; // <-- Para guardar el id del expediente creado
  informeresumen_id: number = 0; // <-- Ya está declarada, perfecto




  expedienteData: ExpedienteFormulario | null = null;
  loadingDictamenesPDF = false;
  loadingDictamenesDOCX = false;
  loadingMovimientosPDF = false;
  loadingMovimientosDOCX = false;

  pdfDictamenes: Blob | null = null;
  docxDictamenes: Blob | null = null;
  pdfMovimientos: Blob | null = null;
  docxMovimientos: Blob | null = null;


  constructor(private pdfGenerator: PdfGeneratorService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private medioBasicoService: MediobasicoService,
    private dictamenService: DictamenService,
    private areaService: AreaService,
    private caracteristicaService: CaracteristicaService,
    private clasificacionService: ClasificacionService,
    private expedienteService: ExpedienteService,
    private informeResumenService: InformeresumenService,
    private comisionmiembroService: ComisionmiembrosService,
    private estructuraService: EstructuraService,
    private movimientoService: MovimientoaftService,
    private snackBar: MatSnackBar,
    private notificacionservice: NotificacionService,
  ) { }

  ngOnInit() {
    this.resetLoadingStates();
    this.areaService.getAllSimple().subscribe(areas => this.areas = areas);
    this.caracteristicaService.listAll().subscribe(caracs => this.caracteristicas = caracs);
    this.clasificacionService.listAll().subscribe(clasifs => this.clasificaciones = clasifs);
    this.comisionmiembroService.listAll().subscribe(miembros => this.miembrosComision = miembros)
    this.estructuraService.getAllSimple().subscribe(estructuras => this.estructuras = estructuras)

  }

  ngOnDestroy() {
    this.resetLoadingStates();
  }

  private resetLoadingStates() {
    this.loadingDictamenesPDF = false;
    this.loadingMovimientosPDF = false;
    this.pdfDictamenes = null;
    this.pdfMovimientos = null;
    this.docxDictamenes = null;
    this.docxMovimientos = null;
  }


  goToStep(index: number) {
    if (index <= this.currentStep) {
      this.currentStep = index;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1 && this.canContinue()) {
      this.currentStep++;
    }
  }

  canContinue(): boolean {
    switch (this.currentStep) {
      case 0: return this.excelData.length > 0;
      case 1: return !!this.expedienteData;
      case 2: return this.excelData.length > 0;
      default: return true;
    }
  }

  onExcelLoaded(data: AFTRegistro[]) {
    this.excelData = data;


  }

  onExpedienteFormCompleted(formData: ExpedienteFormulario & { idexpediente?: number }) {
    this.expedienteData = formData;
  }

  onAftTableEdited(editedData: AFTRegistro[]) {
    this.excelData = editedData;
  }



  getAreaId(area: string, codigoArea?: string): number | null {
    // Si tienes código y nombre, busca por ambos
    if (codigoArea) {
      const found = this.areas.find(a =>
        a.codigo_area.trim() === codigoArea.trim() &&
        a.nombre_area.trim().toUpperCase() === area.trim().toUpperCase()
      );
      if (found) return found.idarea!;
    }
    // Si solo tienes el nombre
    const found = this.areas.find(a =>
      a.nombre_area.trim().toUpperCase() === area.trim().toUpperCase()
    );
    return found ? found.idarea! : null;
  }

  getCaracteristicaId(caracteristica: string): number | null {
    const found = this.caracteristicas.find(c =>
      c.descripcion_c.trim().toUpperCase() === caracteristica.trim().toUpperCase()
    );
    return found ? found.idcaracteristica : null;
  }

  getComisionId(idmiembro: number): number {
    const found = this.miembrosComision.find(m =>
      m.idcomisionmiembro === Number(idmiembro)
    );
    return found ? found.comision_id : 0;
  }

  getClasificacionId(clasificacion: string): number | null {
    const found = this.clasificaciones.find(c =>
      c.descripcion.trim().toUpperCase() === clasificacion.trim().toUpperCase()
    );
    return found ? found.idclasificacion : null;
  }


  descargarDictamenesPDF() {
    if (!this.expedienteData || this.excelData.length === 0) {
      alert('Complete los pasos anteriores primero');
      return;
    }
    this.loadingDictamenesPDF = true;
    this.pdfGenerator.generateDictamenesPDF(this.expedienteData, this.excelData)
      .subscribe({
        next: (blob: Blob) => {
          this.loadingDictamenesPDF = false;
          this.cdr.detectChanges();
          this.saveBlob(blob, 'dictamenes_tecnicos.pdf');
        },
        error: (err) => {
          this.loadingDictamenesPDF = false;
          this.cdr.detectChanges();
          alert('Error generando dictámenes PDF: ' + err);
        },

      });
  }


  descargarDictamenesDocx() {
    if (!this.expedienteData || this.excelData.length === 0) {
      alert('Complete los pasos anteriores primero');
      return;
    }
    this.loadingDictamenesDOCX = true;
    this.pdfGenerator.generateDictamenesDocx(this.expedienteData, this.excelData)
      .subscribe({
        next: (blob: Blob) => {
          this.loadingDictamenesDOCX = false;
          this.cdr.detectChanges();
          this.saveBlob(blob, 'dictamenes_tecnicos.docx');
        },
        error: (err) => {
          this.loadingDictamenesDOCX = false;
          this.cdr.detectChanges();
          alert('Error generando dictámenes DOCX: ' + err);
        }
      });
  }



  descargarMovimientosPDF() {
    if (!this.expedienteData || this.excelData.length === 0) {
      alert('Complete los pasos anteriores primero');
      return;
    }
    this.loadingMovimientosPDF = true;
    this.pdfGenerator.generateMovimientosAgrupados(this.expedienteData, this.excelData)
      .subscribe({
        next: (blob: Blob) => {
          this.loadingMovimientosPDF = false;
          this.saveBlob(blob, 'movimientos_aft.pdf');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loadingMovimientosPDF = false;
          alert('Error generando movimientos PDF: ' + err);
          this.cdr.detectChanges();
        }
      });
  }


  async descargarMovimientosDocx() {
    if (!this.expedienteData || this.excelData.length === 0) {
      alert('Complete los pasos anteriores primero');
      return;
    }
    this.loadingMovimientosDOCX = true;
    try {
      await this.pdfGenerator.generarYDescargarMovimientosDocx(this.expedienteData, this.excelData);
      // No necesitas saveBlob aquí si ya se descarga dentro del método
    } catch (err: any) {
      alert('Error generando movimientos DOCX: ' + err);
    } finally {
      this.loadingMovimientosDOCX = false;
      this.cdr.detectChanges();
    }
  }


  private saveBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }


  async crearMedioBasicoIndividual(medio: Mediobasico): Promise<number> {
    try {
      // Llama al servicio y espera el ID del medio básico creado
      const resp = await this.medioBasicoService.create(medio).toPromise();
      const idmediobasico = resp?.idmediobasico!;
      return idmediobasico;
    } catch (error) {
      alert('Error creando medio básico: ' + error);
      throw error;
    }
  }

  async crearMediosBasicosMasivos(medios: MedioBasicoDictamenMasivo[]): Promise<{ idmediobasico: number }[]> {
    try {
      // Llama al servicio masivo y espera el array de resultados
      const resp = await this.medioBasicoService.createMasivo(medios).toPromise();
      // La respuesta es { resultados: [{ idmediobasico, ... }, ...] }
      return resp?.resultados!;
    } catch (error) {
      alert('Error creando medios básicos: ' + error);
      throw error;
    }
  }

  async crearDictamen(dictamen: Dictamen): Promise<number> {
    try {
      // Llama al servicio y espera el ID del dictamen creado
      const resp = await this.dictamenService.create(dictamen).toPromise();
      const iddictamen = resp!.iddictamen;
      return iddictamen;
    } catch (error) {
      alert('Error creando dictamen: ' + error);
      throw error;
    }
  }

  guardarAfts() {
    this.guardarTodo();
  }

  async CrearAreas_No_Existe(estructura_id: number) {
    const exceldata = this.excelData;
    let area: Area[] = [];
    exceldata.forEach(element => {
      const areaRegex = /^(\S+)\s*-\s*(.+)$/;
      const areaMatch = areaRegex.exec(element.area.trim());
      let codigo_area = '', nombre_area = '';
      if (areaMatch) {
        codigo_area = areaMatch[1].trim();
        nombre_area = areaMatch[2].trim();
      } else {
        nombre_area = element.area.trim();
      }
      const data: Area = { codigo_area, nombre_area, estructura_id };
      area.push(data);
    });
    this.areaService.createMasivo(area).subscribe({
      next: () => {
        this.areaService.getAllSimple().subscribe({
          next: res => this.areas = res,
        })
      },

    });
  }


  async guardarTodo() {
    try {
      // 1. Crear expediente

      const expediente: Expediente = {
        no_expediente: this.expedienteData?.no_expediente ?? '',
        fecha_creacion: this.expedienteData?.fecha_creacion ?? new Date().toISOString().slice(0, 10),
        estado: 'Iniciado',
        estructura_id: this.expedienteData?.estructura_id ?? 1
      };
      const expedienteResp = await this.expedienteService.create(expediente).toPromise();
      this.idexpediente = expedienteResp?.idexpediente ?? 0;
      if (!this.idexpediente) throw new Error('No se pudo crear el expediente');


      // 2. Crear informe resumen
      const informePayload: InformeResumen = {
        expediente_id: this.idexpediente,
        fecha_informe: this.expedienteData?.fecha_creacion ?? new Date().toISOString().slice(0, 10),
        autorizado_por_id: Number(this.expedienteData?.nombreSolicitante),
        aprobado_por_id: Number(this.expedienteData?.nombreJefeAprueba),
        jefe_comision_id: Number(this.expedienteData?.jefeComision),
        observaciones: ''
      };
      const informeResp = await this.informeResumenService.create(informePayload).toPromise();
      this.informeresumen_id = informeResp?.idinforme ?? 0;
      if (!this.informeresumen_id) throw new Error('No se pudo crear el informe resumen');


      // 3. Crear áreas (esperar a que termine)
      await this.CrearAreas_No_Existe(Number(this.expedienteData?.estructura_id));


      // 4. Recargar catálogo de áreas para tener los nuevos IDs
      const areaResp = await this.areaService.getAllSimple().toPromise() ?? this.areas;
      this.areas = Array.isArray(areaResp) ? areaResp : []


      // 5. Agrupar y asignar movimientos
      await this.agruparYAsignarMovimientos();


      // 6. Preparar medios básicos (usando el catálogo actualizado)
      const mediosBasicos: MedioBasicoDictamenMasivo[] = this.prepararMediosBasicos();



      // 7. Crear todos los medios básicos de una vez (masivo)
      const resp = await this.medioBasicoService.createMasivo(mediosBasicos).toPromise();
      const resultados: { idmediobasico: number }[] = resp?.resultados ?? [];
      if (resultados.length !== this.excelData.length) {
        throw new Error('No se crearon todos los medios básicos');
      }

      // // 8. Para cada medio básico creado, crear su dictamen
      // for (let i = 0; i < resultados.length; i++) {
      //   const res = resultados[i];
      //   const aft = this.excelData[i];
      //   const dictamen: Dictamen = this.prepararDictamenParaMedio(res.idmediobasico, aft);
      //   await this.crearDictamen(dictamen);
      // }

      const mensaje = ('Expediente, informe, áreas, medios básicos y dictámenes creados correctamente');
      this.notificacionservice.mostrarMensaje(mensaje, true, 'success');
    } catch (error) {
      const mensaje = ('Error en el guardado masivo: ' + error);
      this.notificacionservice.mostrarMensaje(mensaje, true, 'error');
    }
  }


  separarCodigoYNombreArea(area: string): { codigo: string, nombre: string } {
    // Separar solo por el primer " - " (espacio-guion-espacio)
    const separador = ' - ';
    const idx = area.indexOf(separador);
    if (idx !== -1) {
      const codigo = area.substring(0, idx).trim();
      const nombre = area.substring(idx + separador.length).trim();
      return { codigo, nombre };
    } else {
      // Si no hay separador, todo es nombre
      return { codigo: '', nombre: area.trim() };
    }
  }

  prepararMediosBasicos(): MedioBasicoDictamenMasivo[] {
    return this.excelData.map(aft => {
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);
      return {
        // Medio básico
        no_inventario: aft.mb,
        aft: aft.aft,
        area_id: this.getAreaId(nombre, codigo)!,
        caracteristica_id: this.getCaracteristicaId(aft.caracteristica)!,
        clasificacion_id: this.getClasificacionId(aft.clasificacion)!,
        movimiento_id: this.movimientosMap.get(aft) ?? 0,
        informeresumen_id: this.informeresumen_id,

        // Dictamen
        no_dictamen: aft.noDictamen,
        expediente_id: this.idexpediente,
        directivo_solicita_id: Number(this.expedienteData?.nombreSolicitante),
        argumentacion_tecnica: aft.argumentacion,
        destino_final: aft.destinoFinal,
        conclusion_reparable: !!aft.conclusionNoReparable,
        fecha_dictamen: this.generarFechaDictamen(aft),
        estructura_solicita_id: Number(this.expedienteData?.estructura_id),
        comision_id: this.getComisionId(Number(this.expedienteData?.jefeComision))
      };
    });
  }


  prepararDictamenParaMedio(idmediobasico: number, aft: AFTRegistro): Dictamen {
    let miembrocomisionData: any;
    this.comisionmiembroService.getByIdDetalle(Number(this.expedienteData?.jefeComision)).subscribe({
      next: (res) => {
        miembrocomisionData = res;
      },

    });
    this.idexpediente;
    return {
      no_dictamen: String(aft.noDictamen),
      expediente_id: this.idexpediente,
      mediobasico_id: idmediobasico,
      directivo_solicita_id: Number(this.expedienteData?.nombreSolicitante),
      caracteristica_id: this.getCaracteristicaId(aft.caracteristica),
      argumentacion_tecnica: aft.argumentacion,
      destino_final: aft.destinoFinal,
      conclusion_reparable: !!aft.conclusionNoReparable,
      fecha_dictamen: this.generarFechaDictamen(aft),
      estructura_solicita_id: Number(this.expedienteData?.estructura),
      comision_id: this.getComisionId(Number(this.expedienteData?.jefeComision))!,

    };
  }



  generarFechaDictamen(aft: AFTRegistro): string {
    if (aft.fechaAno && aft.fechaMes && aft.fechaDia) {
      return `${aft.fechaAno}-${aft.fechaMes.padStart(2, '0')}-${aft.fechaDia.padStart(2, '0')}`;
    }
    return new Date().toISOString().slice(0, 10); // Por defecto, hoy
  }

  // obtenerEstructuraSolicitaId(aft: AFTRegistro): number {
  //   // Implementa tu lógica aquí, por ejemplo, buscar en catálogo según área, etc.
  //   return 1; // Valor fijo de ejemplo
  // }

  // obtenerComisionId(aft: AFTRegistro): number {
  //   // Implementa tu lógica aquí, por ejemplo, según tipo de medio básico
  //   return 1; // Valor fijo de ejemplo
  // }

  /**
  * Agrupa los registros de Excel por clasificación y área,
  * crea un movimiento para cada grupo (simulado aquí con un contador)
  * y asocia el movimiento_id a cada registro usando el Map movimientosMap.
  */
  async agruparYAsignarMovimientos(): Promise<void> {
    // 1. Agrupar por clasificación y área
    const agrupaciones = new Map<string, AFTRegistro[]>();
    this.excelData.forEach(aft => {
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);
      const area_id = this.getAreaId(nombre, codigo);
      const clasificacion_id = this.getClasificacionId(aft.clasificacion);
      if (!area_id || !clasificacion_id) return; // Salta si faltan datos
      const clave = `${clasificacion_id}|${area_id}`;
      if (!agrupaciones.has(clave)) agrupaciones.set(clave, []);
      agrupaciones.get(clave)!.push(aft);
    });

    this.movimientosMap.clear();

    // 2. Obtener datos de personas y estructura
    const expediente_id = this.idexpediente;
    const estructura_id = Number(this.expedienteData?.estructura_id);
    const estructura = this.estructuras?.find(e => e.idestructura === estructura_id);
    const entidad_id = estructura?.entidad_id ?? 1; // Por defecto 1 si no encuentras

    // Personas del informe resumen
    const hecho_por_id = Number(this.expedienteData?.nombreSolicitante) || Number(this.expedienteData?.autorizado_por_id);
    const autorizado_por_id = Number(this.expedienteData?.autorizado_por_id) || hecho_por_id;
    const aprobado_por_id = Number(this.expedienteData?.nombreJefeAprueba);

    // 3. Por cada grupo, crea el movimiento real y asigna el ID
    for (const [clave, grupo] of agrupaciones.entries()) {
      const tipo_movimiento_id = 7; // AJUSTE DE INVENTARIO - BAJA

      const movimientoPayload = {
        expediente_id,
        entidad_id,
        tipo_movimiento_id,
        hecho_por_id,
        autorizado_por_id,
        aprobado_por_id,
        fecha_movimiento: new Date().toISOString().slice(0, 10),
        fundamentacion_operacion: "Propuesto a baja"
      };

      let movimientoResp;
      try {
        movimientoResp = await this.movimientoService.create(movimientoPayload).toPromise();
      } catch (err) {
        alert('Error creando movimiento: ' + err);
        throw err;
      }
      const movimientoId = movimientoResp?.idmovimiento;
      if (!movimientoId) throw new Error('No se pudo obtener el id del movimiento');

      // Asocia el movimiento_id real a cada registro del grupo
      grupo.forEach(aft => this.movimientosMap.set(aft, movimientoId));
    }
  }



 
}







