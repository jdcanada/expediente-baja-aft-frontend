import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedienteService } from '../../services/expediente/expediente.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { ExpedienteFormulario } from '../../models/expedienteformulario';
import { AFTRegistro } from '../../models/aftregistro';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-document-preview',
  standalone: true,
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css'],
  imports: [CommonModule, FormsModule, MatIcon],
  providers: [DatePipe],
})
export class DocumentPreviewComponent implements OnInit {
  @Input() expedienteId: number | null = null;
  @Input() expedienteData: ExpedienteFormulario | null = null;
  @Input() registros: AFTRegistro[] = [];

  informeData: any = null;
  isLoading = false;

  constructor(
    private datePipe: DatePipe,
    private expedienteService: ExpedienteService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit() {
    if (this.expedienteId) {
      this.cargarInformeDesdeBD();
    }
  }

  async cargarInformeDesdeBD() {
    if (!this.expedienteId) return;

    this.isLoading = true;
    try {
      this.informeData = await this.expedienteService.getInformeResumen(this.expedienteId).toPromise();
      
      // Transformar datos para el template
      if (this.informeData?.medios) {
        this.registros = this.informeData.medios.map((medio: any, index: number) => ({
          consecutivo: index + 1,
          mb: medio.no_inventario,
          aft: medio.aft,
          area: this.informeData.area?.nombre_area || 'N/A',
          noDictamen: medio.no_dictamen || '',
          caracteristica: medio.caracteristica || '',
          destinoFinal: medio.destino_final || '',
          clasificacion: medio.clasificacion || '',
          argumentacion: medio.argumentacion_tecnica || ''
        }));
      }
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error cargando informe:', error);
      this.notificacionService.mostrarMensaje('Error al cargar datos del informe', true, 'error');
      this.isLoading = false;
    }
  }

  getExpedienteDisplay(): any {
    if (this.informeData) {
      return {
        numero_expediente: this.informeData.expediente?.numero_expediente,
        fecha_creacion: this.informeData.expediente?.fecha_creacion,
        centroCostoCodigo: this.informeData.estructura?.codigo_centro_costo,
        centroCostoNombre: this.informeData.estructura?.nombre_estructura,
        direccionSolicita: this.informeData.estructura?.nombre_estructura,
        cargoSolicitante: this.informeData.autorizado_por?.cargo?.nombre_cargo,
        nombreSolicitante: this.informeData.autorizado_por ? `${this.informeData.autorizado_por.nombre} ${this.informeData.autorizado_por.apellidos}` : '',
        cargoJefeAprueba: this.informeData.aprobado_por?.cargo?.nombre_cargo,
        nombreJefeAprueba: this.informeData.aprobado_por ? `${this.informeData.aprobado_por.nombre} ${this.informeData.aprobado_por.apellidos}` : '',
        jefeComision: this.informeData.jefe_comision?.persona ? `${this.informeData.jefe_comision.persona.nombre} ${this.informeData.jefe_comision.persona.apellidos}` : ''
      };
    }
    return this.expedienteData;
  }

  obtenerTextoFecha(fecha?: string) {
    const fechaFormateada = this.datePipe.transform(fecha, 'd - M - yyyy');
    return fechaFormateada || '';
  }

  obtenerAreasResponsabilidad(): string[] {
    if (!this.registros) return [];
    const areas = this.registros.map(r => r.area);
    return Array.from(new Set(areas));
  }

  async generarPDF() {
    if (typeof window !== 'undefined') {
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;
      await import('pdfmake/build/vfs_fonts');

      const expediente = this.getExpedienteDisplay();
      const areas = this.obtenerAreasResponsabilidad();
      const registros = this.registros;

      const docDefinition = {
        content: [
          // Página 1: Resumen del expediente
          { text: 'MINISTERIO DE EDUCACIÓN SUPERIOR', alignment: 'center', bold: true, fontSize: 12 },
          { text: [{ text: 'Expediente No.: ', bold: true }, expediente?.numero_expediente], margin: [0, 10, 0, 0] },
          { text: [{ text: 'Fecha: ', bold: true }, this.obtenerTextoFecha(expediente?.fecha_creacion)] },
          { text: [{ text: 'Empresa o Unidad Presupuestada: ', bold: true }, 'Universidad de las Ciencias Informáticas.'], margin: [0, 0, 0, 10] },
          { text: 'RESUMEN DEL EXPEDIENTE POR BAJAS DE ACTIVOS FIJOS TANGIBLES (AFT)', alignment: 'center', bold: true, fontSize: 12, margin: [0, 10, 0, 10] },
          {
            text: [
              'Por este medio solicitamos a la Dirección de Contabilidad que se tramite la baja de los siguientes ',
              { text: `${registros.length}`, bold: true },
              ' AFT que se encuentran en mal estado perteneciente al centro de costo ',
              { text: `${expediente?.centroCostoCodigo} - ${expediente?.centroCostoNombre}`, bold: true },
              ', en las áreas de responsabilidad:'
            ]
          },
          { ol: areas, margin: [30, 0, 0, 0] },
          {
            text: 'Las causas que dieron origen a las bajas son las siguientes: El deterioro por rotura, por lo cual no están aptos para su uso.',
            margin: [0, 10, 0, 10]
          },
          { text: 'Documentos que componen el expediente:', bold: true, margin: [0, 5, 0, 5] },
          {
            ul: [
              'RESUMEN DEL EXPEDIENTE POR BAJAS DE ACTIVOS FIJOS TANGIBLES (AFT).',
              'Carta de solicitud a la comisión de baja de AFT-UCI.',
              'Modelo de propuesta de baja de los AFT. (Anexo I)',
              'Modelo de Solicitud de Dictamen Técnico de los AFT propuestos a baja a la Dirección de Mantenimiento u Otras Direcciones. (Anexo II)',
              'Resumen de los Dictámenes Técnicos (Anexo III)',
              'Acta de Entrega de los AFT a la Dirección de Servicios Generales. (Anexo IV)',
              'Copia de la factura de la Empresa Materia Prima para concluir su destino final. (Anexo V)',
              'Modelos de movimiento básico de los AFT propuesto a baja (Anexo VI)',
              'Certificación y Aprobación de la comisión de baja de AFT-UCI. (Anexo VII)'
            ],
            margin: [30, 0, 0, 0]
          },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 10, 0, 5] },
          { text: [{ text: 'Autorizado por: ', bold: true }, `${expediente?.cargoSolicitante} ${expediente?.nombreSolicitante}`] },
          { text: [{ text: 'Aprobado por: ', bold: true }, `${expediente?.cargoJefeAprueba || ''} ${expediente?.nombreJefeAprueba || ''}`] },
          { text: [{ text: 'Jefe de la Comisión de baja de AFT-UCI: ', bold: true }, `${expediente?.jefeComision || ''}`] },
          { text: '', pageBreak: 'after' },

          // Resto de páginas (mantener igual que antes)
          // Página 2: Acta de Solicitud de Bajas
          { text: 'A: COMISIÓN DE BAJAS DE AFT-UCI', bold: true },
          { text: `DE: ${expediente?.direccionSolicita || ''}` },
          { text: 'Acta de Solicitud de Bajas de los AFT', alignment: 'center', bold: true, margin: [0, 10, 0, 10] },
          {
            text: [
              'Por medio de la presente, solicitamos la presencia de la Comisión de Bajas de los AFT en nuestra área, ',
              { text: `${expediente?.centroCostoCodigo} - ${expediente?.centroCostoNombre}`, bold: true },
              ' de las áreas de responsabilidad:'
            ]
          },
          { ol: areas },
          {
            text: 'Para valorar y proceder las bajas por deterioro o en mal estado de los que no están aptos para su uso.',
            margin: [0, 10, 0, 10]
          },
          { text: 'Y para que así conste y en espera de su atención,', margin: [0, 10, 0, 10] },
          { text: [{ text: 'Aprobado por: ', bold: true }, `${expediente?.nombreSolicitante}`] },
          { text: [{ text: 'Cargo: ', bold: true }, `${expediente?.cargoSolicitante}`] },
          { text: '', pageBreak: 'after' },

          // Página 3: ANEXO I
          { text: 'ANEXO I. Modelo de propuesta a baja de los AFT que se encuentran en mal estado o deteriorados totalmente.', bold: true, margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: [30, 80, '*', 100],
              body: [
                [{ text: 'NO.', style: 'tableHeader' }, { text: 'NO. INVENTARIO', style: 'tableHeader' }, { text: 'AFT', style: 'tableHeader' }, { text: 'ÁREA DE RESPONSABILIDAD', style: 'tableHeader' }],
                ...registros.map((r, i) => [i + 1, r.mb, r.aft, r.area])
              ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 10]
          },
          { text: [{ text: 'Aprobado por: ', bold: true }, `${expediente?.nombreSolicitante}`] },
          { text: [{ text: 'Cargo: ', bold: true }, `${expediente?.cargoSolicitante}`] },
          { text: '', pageBreak: 'after' },

          // Página 4: ANEXO II
          { text: 'ANEXO II. Modelo de Solicitud de Dictamen Técnico de los AFT propuestos a baja a la Dirección de Mantenimiento u Otras Direcciones.', bold: true, margin: [0, 0, 0, 10] },
          { text: 'A: Jefe de la Comisión de AFT', bold: true },
          { text: `De: ${expediente?.direccionSolicita || ''}` },
          { text: 'Acta de Solicitud de Dictamen Técnico de los AFT', alignment: 'center', bold: true, margin: [0, 10, 0, 10] },
          {
            text: [
              'Por medio de la presente solicitamos a su comisión el dictamen técnico de los ',
              { text: `${registros.length}`, bold: true },
              ' AFT perteneciente al centro de costo ',
              { text: `${expediente?.centroCostoCodigo} - ${expediente?.centroCostoNombre}`, bold: true },
              ', de las áreas de Responsabilidad:'
            ]
          },
          { ol: areas },
          {
            text: 'Para valorar y proceder las bajas por deterioro o mal estado de los mismos que no están aptos para su uso.',
            margin: [0, 10, 0, 10]
          },
          { text: 'Y para que así conste y en espera de su atención,', margin: [0, 10, 0, 10] },
          { text: [{ text: 'Aprobado por: ', bold: true }, `${expediente?.nombreSolicitante}`] },
          { text: [{ text: 'Cargo: ', bold: true }, `${expediente?.cargoSolicitante}`] },
          { text: '', pageBreak: 'after' },

          // Página 5: ANEXO III
          { text: 'ANEXO III. Resumen de los Dictámenes Técnicos', bold: true, margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: [30, 80, '*', 100, 60, 60],
              body: [
                [{ text: 'NO.', style: 'tableHeader' }, { text: 'NO. INVENTARIO', style: 'tableHeader' }, { text: 'AFT', style: 'tableHeader' }, { text: 'ÁREAS DE RESPONSABILIDAD', style: 'tableHeader' }, { text: 'NO. DICTAMEN', style: 'tableHeader' }, { text: 'FECHA', style: 'tableHeader' }],
                ...registros.map((r, i) => [i + 1, r.mb, r.aft, r.area, r.noDictamen || '', this.obtenerTextoFecha(expediente?.fecha_creacion)])
              ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 10]
          },
          { text: '', pageBreak: 'after' },

          // Página 6: ANEXO IV
          { text: 'ANEXO IV. Acta de Entrega de los AFT a la Dirección de Servicios Generales.', bold: true, margin: [0, 0, 0, 10] },
          {
            text: [
              'Siendo las ________ horas del día ______________________del año _______ se realiza la entrega de los ',
              { text: `${registros.length}`, bold: true },
              ' AFT pertenecientes al centro de costo ',
              { text: `${expediente?.centroCostoCodigo} - ${expediente?.centroCostoNombre}`, bold: true },
              ' que aprobados por la comisión de bajas de la Universidad ______________________dictaminó como deteriorados y en mal estado con el objetivo de concluir su destino Final.'
            ]
          },
          {
            table: {
              headerRows: 1,
              widths: [30, 80, '*', 100, 80],
              body: [
                [{ text: 'NO.', style: 'tableHeader' }, { text: 'NO. INVENTARIO', style: 'tableHeader' }, { text: 'AFT', style: 'tableHeader' }, { text: 'ÁREAS DE RESPONSABILIDAD', style: 'tableHeader' }, { text: 'Destino Final', style: 'tableHeader' }],
                ...registros.map((r, i) => [i + 1, r.mb, r.aft, r.area, r.destinoFinal || ''])
              ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 10]
          },
          {
            table: {
              widths: ['23%', '23%', '1%', '23%', '23%'],
              body: [
                [
                  { text: 'Área que entrega:', alignment: 'right', border: [false, false, false, false] },
                  { text: '______________________', border: [false, false, false, false] },
                  { text: '', border: [false, false, false, false] },
                  { text: 'Área que recibe: ', alignment: 'right', border: [false, false, false, false] },
                  { text: '______________________', border: [false, false, false, false] },
                ],
                [
                  { text: 'Nombres y Apellidos:', alignment: 'right', border: [false, false, false, false] },
                  { text: '______________________', border: [false, false, false, false] },
                  { text: '', border: [false, false, false, false] },
                  { text: 'Nombres y Apellidos: ', alignment: 'right', border: [false, false, false, false] },
                  { text: '______________________', border: [false, false, false, false] },
                ],
                [
                  { text: 'Firma y Cuño:', alignment: 'right', border: [false, false, false, false] },
                  { text: '______________________', border: [false, false, false, false] },
                  { text: '', border: [false, false, false, false] },
                  { text: 'Firma y Cuño:', alignment: 'right', border: [false, false, false, false] },
                  { text: '______________________', border: [false, false, false, false] },
                ]
              ]
            },
            layout: 'noBorders',
            margin: [0, 10, 0, 5],
          },
          { text: '', pageBreak: 'after' },

          // Página 7: ANEXO V
          { text: 'ANEXO V. Copia de la factura de la Empresa Materia Prima para concluir su destino final.', bold: true, margin: [0, 0, 0, 10] },
          { text: '', pageBreak: 'after' },

          // Página 8: ANEXO VI
          { text: 'ANEXO VI. Modelo de Movimiento Básico que propone la baja del AFT.', bold: true, margin: [0, 0, 0, 10] },
          { text: '', pageBreak: 'after' },

          // Página 9: ANEXO VII
          { text: 'ANEXO VII. Certificación y Aprobación de la Comisión de Bajas de AFT-UCI.', bold: true, margin: [0, 0, 0, 10] }
        ],
        styles: {
          header: { fontSize: 12, bold: true },
          subheader: { fontSize: 8, bold: true },
          tableHeader: { bold: true, fillColor: '#f0f0f0' }
        },
        defaultStyle: {
          fontSize: 9,
          lineHeight: 1.15
        }
      };

      pdfMake.createPdf(docDefinition).download(`informe_resumen_${expediente?.numero_expediente}.pdf`);
    }
  }
}