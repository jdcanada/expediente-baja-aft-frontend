import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AFTRegistro } from '../../models/aftregistro';
import { ExpedienteFormulario } from '../../models/expedienteformulario';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { ExpedienteFormComponent } from "../expediente/expediente-form/expediente-form.component";
import { UploadExcelComponent } from "../upload-excel/upload-excel.component";
import { DocumentPreviewComponent } from "../document-preview/document-preview.component";
import { MediobasicoService } from '../../services/mediobasico/mediobasico.service';
import { AreaService } from '../../services/area/area.service';
import { CaracteristicaService } from '../../services/caracteristica/caracteristica.service';
import { ClasificacionService } from '../../services/clasificacion/clasificacion.service';
import { ExpedienteService } from '../../services/expediente/expediente.service';
import { ComisionmiembrosService } from '../../services/comisionmiembros/comisionmiembros.service';
import { ComisionMiembroDetalle } from '../../models/comisionMiembro';
import { Area, AreaDetalleSimple } from '../../models/area';
import { Expediente } from '../../models/expediente';
import { Estructura } from '../../models/estructura';
import { EstructuraService } from '../../services/estructura/estructura.service';
import { MovimientoaftService } from '../../services/movimientoaft/movimientoaft.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  standalone: true,
  selector: 'app-wizard-expediente',
  templateUrl: './wizard-expediente.component.html',
  styleUrls: ['./wizard-expediente.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ExpedienteFormComponent,
    UploadExcelComponent,
    DocumentPreviewComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class WizardExpedienteComponent {
  // Pasos simplificados
  steps = [
    { label: 'Cargar Excel' },
    { label: 'Datos y Guardar' },
    { label: 'Dictámenes' },
    { label: 'Movimientos' },
    { label: 'Informe Resumen' }
  ];

  currentStep = 0;
  excelData: AFTRegistro[] = [];
  expedienteData: ExpedienteFormulario | null = null;
  expedienteCreadoId: number | null = null;

  // Estados de carga
  isLoading = false;
  loadingDictamenes = false;
  loadingMovimientos = false;
  loadingInforme = false;

  private catalogosCargados = false;
  private catalogosPendientes = 4; // áreas, características, clasificaciones, miembrosComision

  // Catálogos
  areas: AreaDetalleSimple[] = [];
  caracteristicas: { id_caracteristica: number, descripcion: string }[] = [];
  clasificaciones: { id_clasificacion: number, descripcion: string }[] = [];
  miembrosComision: ComisionMiembroDetalle[] = [];
  estructuras: Estructura[] = [];
  movimientosMap: Map<AFTRegistro, number> = new Map();

  constructor(
    private pdfGenerator: PdfGeneratorService,
    private cdr: ChangeDetectorRef,
    private medioBasicoService: MediobasicoService,
    private areaService: AreaService,
    private caracteristicaService: CaracteristicaService,
    private clasificacionService: ClasificacionService,
    private expedienteService: ExpedienteService,
    private comisionmiembroService: ComisionmiembrosService,
    private estructuraService: EstructuraService,
    private movimientoService: MovimientoaftService,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit() {
    this.cargarCatalogos();
  }

  private cargarCatalogos() {
    this.catalogosCargados = false;

    // Cargar áreas
    this.areaService.listAll().subscribe({
      next: (data) => {
        this.areas = Array.isArray(data) ? data : [];
        console.log('✅ ÁREAS cargadas:', this.areas.length);
        this.verificarCatalogosCompletos();
      },
      error: (err) => {
        console.error('Error cargando áreas:', err);
        this.verificarCatalogosCompletos();
      }
    });

    // Cargar características
    this.caracteristicaService.listAll().subscribe({
      next: (data) => {
        this.caracteristicas = Array.isArray(data) ? data : [];
        this.verificarCatalogosCompletos();
      },
      error: (err) => {
        console.error('Error cargando características:', err);
        this.verificarCatalogosCompletos();
      }
    });

    // Cargar clasificaciones
    this.clasificacionService.listAll().subscribe({
      next: (data) => {
        this.clasificaciones = Array.isArray(data) ? data : [];
        this.verificarCatalogosCompletos();
      },
      error: (err) => {
        console.error('Error cargando clasificaciones:', err);
        this.verificarCatalogosCompletos();
      }
    });

    // Cargar miembros de comisión
    this.comisionmiembroService.listAll().subscribe({
      next: (data) => {
        this.miembrosComision = Array.isArray(data) ? data : [];
        console.log('✅ MIEMBROS COMISIÓN cargados:', this.miembrosComision.length);
        this.verificarCatalogosCompletos();
      },
      error: (err) => {
        console.error('Error cargando miembros comisión:', err);
        this.verificarCatalogosCompletos();
      }
    });
  }

  private verificarCatalogosCompletos() {
    this.catalogosPendientes--;

    if (this.catalogosPendientes === 0) {
      this.catalogosCargados = true;
      console.log('✅ TODOS LOS CATÁLOGOS CARGADOS');
      console.log('   Áreas:', this.areas.length);
      console.log('   Características:', this.caracteristicas.length);
      console.log('   Clasificaciones:', this.clasificaciones.length);
      console.log('   Miembros comisión:', this.miembrosComision.length);
    }
  }

  // Navegación
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
      case 1: return this.expedienteCreadoId !== null;
      default: return true;
    }
  }

  // Eventos de los componentes hijos
  onExcelLoaded(data: AFTRegistro[]) {
    this.excelData = data;
  }

  async onExpedienteFormSubmitted(formData: ExpedienteFormulario) {
    this.expedienteData = formData;
    await this.guardarTodo();
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  separarCodigoYNombreArea(area: string): { codigo: string, nombre: string } {
    const separador = ' - ';
    const idx = area.indexOf(separador);
    if (idx !== -1) {
      return {
        codigo: area.substring(0, idx).trim(),
        nombre: area.substring(idx + separador.length).trim()
      };
    }
    return { codigo: '', nombre: area.trim() };
  }

  // En wizard-expediente.component.ts

  // Normalizar texto: MAYÚSCULAS + SIN TILDES
  private normalizarTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
      .trim();
  }

  getClasificacionId(clasificacion: string): number | null {
    if (!clasificacion) return null;

    const textoNormalizado = this.normalizarTexto(clasificacion);

    const found = this.clasificaciones.find(c =>
      this.normalizarTexto(c.descripcion) === textoNormalizado
    );

    if (!found) {
      console.error(`❌ Clasificación no encontrada: "${clasificacion}"`);
      return null;
    }

    return found.id_clasificacion;
  }


  getCaracteristicaId(caracteristica: string): number | null {
    if (!caracteristica) return null;

    const textoNormalizado = this.normalizarTexto(caracteristica);

    console.log('📦 Catálogo características:', this.caracteristicas.map(c => ({ id: c.id_caracteristica, nombre: c.descripcion })));

    // ✅ Usar los nombres correctos de los campos según tu BD
    const found = this.caracteristicas.find(c =>
      this.normalizarTexto(c.descripcion) === textoNormalizado
    );

    if (!found) {
      console.error(`❌ Característica no encontrada: "${caracteristica}"`);
      return null;
    }

    console.log(`✅ Característica encontrada: "${found.descripcion}" → ID: ${found.id_caracteristica}`);
    return found.id_caracteristica;
  }




  getAreaId(area: string, codigoArea?: string): number | null {
    if (!area) return null;

    // ✅ AGREGAR LOGS AQUÍ - justo al inicio del método
    console.log('🔍 BUSCANDO ÁREA:');
    console.log('   Parámetro area:', area);
    console.log('   Parámetro codigoArea:', codigoArea);
    console.log('   Catálogo áreas completo:', this.areas.map(a => ({
      id: a.id_area,
      codigo: a.codigo_area,
      nombre: a.nombre_area
    })));

    const textoNormalizado = this.normalizarTexto(area);
    console.log('   Nombre normalizado:', textoNormalizado);

    // Buscar por código
    if (codigoArea) {
      const found = this.areas.find(a => a.codigo_area === codigoArea);
      if (found) {
        console.log('✅ Área encontrada por código:', codigoArea, '→ ID:', found.id_area);
        return found.id_area ?? null;
      } else {
        console.log('❌ No encontrada por código:', codigoArea);
      }
    }

    // Buscar por nombre
    const found = this.areas.find(a => {
      const nombreNorm = this.normalizarTexto(a.nombre_area || '');
      return nombreNorm === textoNormalizado;
    });

    if (found) {
      console.log('✅ Área encontrada por nombre:', found.nombre_area, '→ ID:', found.id_area);
      return found.id_area ?? null;
    }

    console.log('❌ Área NO encontrada - Retornando null');
    return null;
  }

  getComisionId(idmiembro: number): number {
    const found = this.miembrosComision.find(m => m.id_miembro === idmiembro);
    return found ? found.comision_id : 1;
  }

  generarFechaDictamen(aft: AFTRegistro): string {
    if (aft.fechaAno && aft.fechaMes && aft.fechaDia) {
      return `${aft.fechaAno}-${aft.fechaMes.padStart(2, '0')}-${aft.fechaDia.padStart(2, '0')}`;
    }
    return new Date().toISOString().slice(0, 10);
  }

  getDestinoFinalId(destinoFinal: string): number | null {
    const destinoMap: { [key: string]: number } = {
      'MATERIAS PRIMAS': 3,
      'DESTRUIR Y BOTAR': 4
    };
    return destinoMap[destinoFinal?.toUpperCase()] || null;
  }

  // ============================================
  // CREAR ÁREAS QUE NO EXISTEN
  // ============================================

  async crearAreasNoExistentes(estructura_id: number) {
    // ✅ Usar this.areas directamente (ya es un array, aunque esté vacío)
    const areasExistentesSet = new Set(this.areas.map(a => a.nombre_area?.toUpperCase()));

    const areasParaCrear: Area[] = [];

    for (const aft of this.excelData) {
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);
      if (nombre && !areasExistentesSet.has(nombre.toUpperCase())) {
        areasParaCrear.push({
          codigo_area: codigo || '',
          nombre_area: nombre,
          estructura_id: estructura_id
        });
        areasExistentesSet.add(nombre.toUpperCase());
      }
    }

    if (areasParaCrear.length > 0) {
      try {
        await this.areaService.createMasivo(areasParaCrear).toPromise();
        // Recargar áreas después de crear nuevas
        const nuevasAreas = await this.areaService.listAll().toPromise();
        this.areas = Array.isArray(nuevasAreas) ? nuevasAreas : [];
      } catch (error) {
        console.error('Error creando áreas:', error);
        throw error;
      }
    }
  }

  // ============================================
  // CREAR MOVIMIENTOS AGRUPADOS
  // ============================================

  async crearMovimientosAgrupados(expediente_id: number): Promise<void> {
    const agrupaciones = new Map<string, {
      clasificacion_id: number,
      area_id: number,
      registros: AFTRegistro[]
    }>();

    for (const aft of this.excelData) {
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);
      const area_id = this.getAreaId(nombre, codigo);

      const clasificacion = this.clasificaciones.find(c =>
        this.normalizarTexto(c.descripcion) === this.normalizarTexto(aft.clasificacion)
      );

      if (!clasificacion) {
        console.error(`❌ Clasificación no encontrada: ${aft.clasificacion}`);
        continue;
      }

      const clasificacion_id = clasificacion.id_clasificacion;

      if (area_id && clasificacion_id) {
        const clave = `${clasificacion_id}|${area_id}`;
        if (!agrupaciones.has(clave)) {
          agrupaciones.set(clave, {
            clasificacion_id: clasificacion_id,
            area_id: area_id,
            registros: []
          });
        }
        agrupaciones.get(clave)!.registros.push(aft);
      }
    }

    this.movimientosMap.clear();

    const hecho_por_id = this.expedienteData?.autorizado_por_id ?? null;
    const aprobado_por_id = this.expedienteData?.aprobado_por_id ?? null;

    for (const [clave, grupo] of agrupaciones.entries()) {
      // ✅ Extraer lista de números de inventario
      const listaInventarios = grupo.registros.map(aft => aft.mb);
      const cantidad = grupo.registros.length;

        const movimientoPayload = {
        expediente_id: expediente_id,
        clasificacion_id: grupo.clasificacion_id,
        area_id: grupo.area_id,                          // ✅ AGREGADO
        lista_inventarios: listaInventarios,              // ✅ AGREGADO
        cantidad: cantidad,                               // ✅ AGREGADO
        tipo_movimiento_id: 7,
        entidad_destino: 'MATERIAS PRIMAS',
        hecho_por_id: hecho_por_id,
        autorizado_por_id: hecho_por_id,
        aprobado_por_id: aprobado_por_id,
        fecha_movimiento: new Date().toISOString().slice(0, 10),
        fundamentacion: 'Propuesto a baja'
      };

      try {
        const resp = await this.movimientoService.create(movimientoPayload).toPromise();
        const movimientoId = resp?.id_movimiento;
        if (movimientoId) {
          grupo.registros.forEach(aft => this.movimientosMap.set(aft, movimientoId));
        }
      } catch (error) {
        console.error(`❌ Error creando movimiento para grupo ${clave}:`, error);
        throw error;
      }
    }

    console.log(`✅ Total movimientos creados: ${agrupaciones.size}`);
  }

  // ============================================
  // PREPARAR MEDIOS BÁSICOS CON DICTÁMENES
  // ============================================

  prepararMediosBasicos(expediente_id: number): any[] {
    // ✅ Obtener estructura_id una sola vez
    const estructuraId = Number(this.expedienteData?.estructura_id);
    const jefeComisionId = Number(this.expedienteData?.jefeComision_id);
    const directivoId = this.expedienteData?.autorizado_por_id;

    // ✅ Validaciones
    if (isNaN(estructuraId) || estructuraId === 0) {
      console.error('❌ estructura_id inválido:', this.expedienteData?.estructura_id);
    }
    if (isNaN(jefeComisionId) || jefeComisionId === 0) {
      console.error('❌ jefeComision_id inválido:', this.expedienteData?.jefeComision_id);
    }

    return this.excelData.map(aft => {
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);
      const movimientoId = this.movimientosMap.get(aft) ?? 0;

      // ✅ Log para verificar movimiento_id
      if (movimientoId === 0) {
        console.warn(`⚠️ AFT ${aft.mb} (${aft.aft}) no tiene movimiento_id asignado`);
      }

      return {
        // Medio básico
        no_inventario: aft.mb,
        aft: aft.aft,
        area_id: this.getAreaId(nombre, codigo)!,
        caracteristica_id: this.getCaracteristicaId(aft.caracteristica)!,
        clasificacion_id: this.getClasificacionId(aft.clasificacion)!,
        movimiento_id: movimientoId,

        // Dictamen
        no_dictamen: String(aft.noDictamen),
        expediente_id: expediente_id,
        directivo_solicita_id: directivoId,
        argumentacion_tecnica: aft.argumentacion,
        destino_final: aft.destinoFinal,
        conclusion_reparable: !!aft.concluye_reparable,
        fecha_dictamen: this.generarFechaDictamen(aft),
        estructura_solicita_id: estructuraId,
        comision_id: this.getComisionId(jefeComisionId)
      };
    });
  }

  // ============================================
  // GUARDAR TODO EN LA BASE DE DATOS
  // ============================================

  // En wizard-expediente.component.ts - guardarTodo() simplificado

  async guardarTodo() {
    if (!this.catalogosCargados) {
      this.notificacionService.mostrarMensaje('Cargando catálogos, espere un momento...', true, 'info');
      return;
    }
    // ============================================
    // VALIDACIÓN DE DATOS BÁSICOS
    // ============================================
    if (!this.expedienteData || this.excelData.length === 0) {
      this.notificacionService.mostrarMensaje('Faltan datos del expediente o del Excel', true, 'error');
      return;
    }

    // ============================================
    // VALIDAR TODOS LOS REGISTROS ANTES DE COMENZAR
    // ============================================
    const errores: string[] = [];
    const clasificacionesError = new Set<string>();
    const areasError = new Set<string>();
    const caracteristicasError = new Set<string>();

    for (const aft of this.excelData) {
      // Validar clasificación
      const clasificacionId = this.getClasificacionId(aft.clasificacion);
      if (!clasificacionId) {
        clasificacionesError.add(aft.clasificacion);
      }

      // Validar área
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);
      const areaId = this.getAreaId(nombre, codigo);
      if (!areaId) {
        areasError.add(aft.area);
      }

      // Validar característica
      const caracteristicaId = this.getCaracteristicaId(aft.caracteristica);
      if (!caracteristicaId) {
        caracteristicasError.add(aft.caracteristica);
      }
    }

    // Construir mensaje de error
    if (clasificacionesError.size > 0) {
      errores.push(`📌 Clasificaciones no encontradas (${clasificacionesError.size}): ${Array.from(clasificacionesError).join(', ')}`);
    }

    if (areasError.size > 0) {
      errores.push(`📌 Áreas no encontradas (${areasError.size}): ${Array.from(areasError).join(', ')}`);
    }

    if (caracteristicasError.size > 0) {
      errores.push(`📌 Características no encontradas (${caracteristicasError.size}): ${Array.from(caracteristicasError).join(', ')}`);
    }

    if (errores.length > 0) {
      this.notificacionService.mostrarMensaje(
        `❌ No se puede guardar el expediente. Verifique los siguientes datos en el Excel:\n\n${errores.join('\n')}`,
        true,
        'error'
      );
      return;
    }

    // ============================================
    // INICIAR GUARDADO
    // ============================================
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      // ============================================
      // 1. Crear expediente
      // ============================================
      const expediente: Expediente = {
        numero_expediente: this.expedienteData.numero_expediente,
        fecha_creacion: this.expedienteData.fecha_creacion,
        estado: 'Iniciado',
        estructura_id: Number(this.expedienteData.estructura_id),
        area_id: 1,
        directivo_solicita_id: this.expedienteData.autorizado_por_id,
        autorizado_por_id: this.expedienteData.autorizado_por_id,
        aprobado_por_id: this.expedienteData.aprobado_por_id,
        jefe_comision_id: this.expedienteData.jefeComision_id,
        causas_generales: 'El deterioro por rotura, por lo cual no están aptos para su uso',
        creado_por_id: 1
      };

      const expedienteResp = await this.expedienteService.create(expediente).toPromise();
      this.expedienteCreadoId = expedienteResp?.id_expediente ?? 0;

      if (!this.expedienteCreadoId) {
        throw new Error('No se pudo crear el expediente');
      }

      // ============================================
      // 2. Crear áreas faltantes
      // ============================================
      await this.crearAreasNoExistentes(Number(this.expedienteData.estructura_id));

   

      // ============================================
      // 4. Preparar y enviar medios básicos
      // ============================================
      const mediosBasicos = this.prepararDatosParaEnvio(this.expedienteCreadoId);


      const resp = await this.medioBasicoService.createMasivoConMovimientos(mediosBasicos).toPromise();


      if (resp.exitosos === 0) {
        throw new Error('No se pudo crear ningún medio básico');
      }

      // ============================================
      // 5. Actualizar estado del expediente
      // ============================================
      await this.expedienteService.update(this.expedienteCreadoId, { estado: 'COMPLETO' } as any);

      // ============================================
      // 6. Mostrar mensaje de éxito
      // ============================================
      const mensaje = resp.fallidos > 0
        ? `Expediente ${this.expedienteData.numero_expediente} guardado con ${resp.exitosos} medios básicos creados y ${resp.fallidos} fallidos`
        : `Expediente ${this.expedienteData.numero_expediente} guardado correctamente con ${resp.exitosos} medios básicos`;

      this.notificacionService.mostrarMensaje(mensaje, true, resp.fallidos > 0 ? 'warning' : 'success');

      // Avanzar al siguiente paso
      this.currentStep++;
      this.isLoading = false;
      this.cdr.detectChanges();

    } catch (error) {
      console.error('❌ Error guardando:', error);
      this.notificacionService.mostrarMensaje('Error al guardar: ' + error, true, 'error');
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }




  // Nuevo método para preparar datos sin movimiento_id
  prepararDatosParaEnvio(expediente_id: number): any[] {
    const estructuraId = Number(this.expedienteData?.estructura_id);
    const jefeComisionId = Number(this.expedienteData?.jefeComision_id);
    const directivoId = this.expedienteData?.autorizado_por_id;
    const aprobadoId = this.expedienteData?.aprobado_por_id;

    const datos = this.excelData.map((aft, index) => {
      const { codigo, nombre } = this.separarCodigoYNombreArea(aft.area);

      const areaId = this.getAreaId(nombre, codigo);
      const caracteristicaId = this.getCaracteristicaId(aft.caracteristica);
      const clasificacionId = this.getClasificacionId(aft.clasificacion);
      const comisionId = this.getComisionId(jefeComisionId);

      return {
        // Medio básico
        no_inventario: aft.mb,
        aft: aft.aft,
        expediente_id: expediente_id,
        area_id: areaId || 1,
        caracteristica_id: caracteristicaId || 1,
        clasificacion_id: clasificacionId || 1,
        argumentacion_tecnica: aft.argumentacion,

        // Dictamen
        no_dictamen: String(aft.noDictamen),
        comision_id: comisionId || 1,
        destino_final: aft.destinoFinal,
        conclusion_reparable: !!aft.concluye_reparable,
        fecha_dictamen: this.generarFechaDictamen(aft),

        // Personas
        directivo_solicita_id: directivoId || 1,
        aprobado_por_id: aprobadoId || directivoId || 1,
        estructura_solicita_id: estructuraId || 1
      };
    });

    return datos;
  }

  // ============================================
  // DESCARGAR DOCUMENTOS DESDE BD
  // ============================================

  async descargarDictamenes() {
    if (!this.expedienteCreadoId) {
      this.notificacionService.mostrarMensaje('Primero debe guardar el expediente', true, 'error');
      return;
    }

    this.loadingDictamenes = true;
    try {
      const datos = await this.expedienteService.getDatosParaDocumento(this.expedienteCreadoId).toPromise();
      if (datos && datos.afts?.length > 0) {
        this.pdfGenerator.generateDictamenesPDF(datos, datos.afts).subscribe({
          next: (blob) => this.saveBlob(blob, 'dictamenes_tecnicos.pdf'),
          error: (err) => this.notificacionService.mostrarMensaje('Error generando PDF: ' + err, true, 'error')
        });
      } else {
        this.notificacionService.mostrarMensaje('No hay datos para generar dictámenes', true, 'warning');
      }
    } catch (error) {
      this.notificacionService.mostrarMensaje('Error al obtener datos', true, 'error');
    } finally {
      this.loadingDictamenes = false;
      this.cdr.detectChanges();
    }
  }

  async descargarMovimientos() {
    if (!this.expedienteCreadoId) {
      this.notificacionService.mostrarMensaje('Primero debe guardar el expediente', true, 'error');
      return;
    }

    this.loadingMovimientos = true;
    try {
      const datos = await this.expedienteService.getDatosParaDocumento(this.expedienteCreadoId).toPromise();
      if (datos && datos.afts?.length > 0) {
        this.pdfGenerator.generateMovimientosAgrupados(datos, datos.afts).subscribe({
          next: (blob) => this.saveBlob(blob, 'movimientos_aft.pdf'),
          error: (err) => this.notificacionService.mostrarMensaje('Error generando PDF: ' + err, true, 'error')
        });
      } else {
        this.notificacionService.mostrarMensaje('No hay datos para generar movimientos', true, 'warning');
      }
    } catch (error) {
      this.notificacionService.mostrarMensaje('Error al obtener datos', true, 'error');
    } finally {
      this.loadingMovimientos = false;
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

  // Agrega este método a tu wizard-expediente.component.ts

  async descargarInformeResumen() {
    if (!this.expedienteCreadoId) {
      this.notificacionService.mostrarMensaje('Primero debe guardar el expediente', true, 'error');
      return;
    }

    this.loadingInforme = true;
    this.cdr.detectChanges();

    try {
      const datos = await this.expedienteService.getDatosParaDocumento(this.expedienteCreadoId).toPromise();
      if (datos && datos.afts?.length > 0) {
        // Reutilizar el mismo método de movimientos (temporalmente)
        this.pdfGenerator.generateMovimientosAgrupados(datos, datos.afts).subscribe({
          next: (blob) => {
            this.saveBlob(blob, `informe_resumen_${this.expedienteData?.numero_expediente}.pdf`);
            this.loadingInforme = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error generando PDF:', err);
            this.notificacionService.mostrarMensaje('Error generando el informe: ' + err, true, 'error');
            this.loadingInforme = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.notificacionService.mostrarMensaje('No hay datos para generar el informe', true, 'warning');
        this.loadingInforme = false;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error:', error);
      this.notificacionService.mostrarMensaje('Error al obtener datos', true, 'error');
      this.loadingInforme = false;
      this.cdr.detectChanges();
    }
  }


}