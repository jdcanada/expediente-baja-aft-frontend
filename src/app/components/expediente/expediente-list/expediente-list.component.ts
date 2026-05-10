import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { ExpedienteService } from '../../../services/expediente/expediente.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { ExpedienteFormComponent } from '../expediente-form/expediente-form.component';
import { ExpedienteDetalleComponent } from '../expediente-detalle/expediente-detalle.component';
import { AuthService } from '../../../services/auth/auth.service';
import { PdfGeneratorService } from '../../../services/pdf-generator/pdf-generator.service';
import { ExpedienteFormulario } from '../../../models/expedienteformulario';

@Component({
  selector: 'app-expediente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './expediente-list.component.html',
  styleUrls: ['./expediente-list.component.css']
})
export class ExpedienteListComponent implements OnInit {
  expedientes: any[] = [];
  filteredExpedientes: any[] = [];
  isLoading = true;
  searchTerm = '';

  // Estilos disponibles
  estilosDisponibles = [
    { id: 'default', nombre: '🎴 Tarjetas Clásicas' },
    { id: 'apiladas', nombre: '📚 Tarjetas Apiladas' },
    { id: 'libro', nombre: '📖 Vista Libro' },
    { id: 'libro-real', nombre: '✨ Libro Real' },
    { id: 'bloc', nombre: '📋 Bloc de Notas' }
  ];
  estiloActual = 'default';

  constructor(
    protected expedienteService: ExpedienteService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    protected authService: AuthService,
    private cdr: ChangeDetectorRef,
    private pdfGenerator: PdfGeneratorService
  ) {
    // Cargar estilo guardado en localStorage
    const savedStyle = localStorage.getItem('expedienteListStyle');
    if (savedStyle && this.estilosDisponibles.some(e => e.id === savedStyle)) {
      this.estiloActual = savedStyle;
    }
  }

  ngOnInit(): void {
    this.loadExpedientes();
  }

  cambiarEstilo(estiloId: string): void {
    this.estiloActual = estiloId;
    localStorage.setItem('expedienteListStyle', estiloId);
    // Forzar re-renderizado
    this.cdr.detectChanges();
  }

  private loadExpedientes(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.expedienteService.listAll().subscribe({
      next: (data) => {
        this.expedientes = data;
        this.filteredExpedientes = [...data];
        this.isLoading = false;
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        this.isLoading = false;
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
        this.notificacionService.mostrarMensaje('Error al cargar expedientes', true, 'error');
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredExpedientes = [...this.expedientes];
      return;
    }

    const lowerTerm = this.searchTerm.toLowerCase().trim();
    this.filteredExpedientes = this.expedientes.filter(exp =>
      exp.numero_expediente?.toLowerCase().includes(lowerTerm) ||
      exp.estado?.toLowerCase().includes(lowerTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredExpedientes = [...this.expedientes];
  }

  abrirFormularioNuevo(): void {
    const dialogRef = this.dialog.open(ExpedienteFormComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpedientes();
      }
    });
  }

  verDetalles(expediente: any): void {
    this.dialog.open(ExpedienteDetalleComponent, {
      width: '1100px',
      maxWidth: '95vw',
      maxHeight: '85vh',
      minHeight: '550px',
      data: expediente
    });
  }

  editarExpediente(expediente: any): void {
    if (!this.puedeEditar(expediente)) {
      this.notificacionService.mostrarMensaje(
        `No se puede editar un expediente en estado "${expediente.estado}".`,
        true,
        'warning'
      );
      return;
    }

    const dialogRef = this.dialog.open(ExpedienteFormComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: { id_expediente: expediente.id_expediente }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadExpedientes();
    });
  }

  eliminarExpediente(expediente: any): void {
    if (!this.puedeEliminar(expediente)) {
      this.notificacionService.mostrarMensaje(
        `No se puede eliminar un expediente en estado "${expediente.estado}".`,
        true,
        'warning'
      );
      return;
    }

    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el expediente "${expediente.numero_expediente}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.expedienteService.delete(expediente.id_expediente).subscribe({
          next: () => {
            this.loadExpedientes();
            this.notificacionService.mostrarMensaje('Expediente eliminado correctamente', true, 'success');
          },
          error: (err) => {
            const msg = err.error?.error || 'Error al eliminar el expediente';
            this.notificacionService.mostrarMensaje(msg, true, 'error');
          }
        });
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'INICIADO': return 'estado-iniciado';
      case 'APROBADO': return 'estado-aprobado';
      case 'COMPLETO': return 'estado-completo';
      case 'RECHAZADO': return 'estado-rechazado';
      default: return 'estado-iniciado';
    }
  }

  puedeEditar(expediente: any): boolean {
    return expediente.estado?.toUpperCase() !== 'APROBADO';
  }

  puedeEliminar(expediente: any): boolean {
    return expediente.estado?.toUpperCase() !== 'APROBADO';
  }

  aprobarExpediente(expediente: any): void {
    if (expediente.estado === 'APROBADO') {
      this.notificacionService.mostrarMensaje('El expediente ya está aprobado', true, 'warning');
      return;
    }

    if (!this.expedienteService.puedeAprobar(expediente)) {
      this.notificacionService.mostrarMensaje('No tiene permisos para aprobar este expediente', true, 'error');
      return;
    }

    this.notificacionService.confirmarAccion(
      `¿Está seguro de APROBAR el expediente "${expediente.numero_expediente}"?\n\n⚠️ Una vez aprobado, NO se podrá modificar ni eliminar.`,
      'Aprobar Expediente', "warning", "Sí, Aprobar", "Cancelar"
    ).then(confirmado => {
      if (confirmado) {
        this.expedienteService.cambiarEstado(expediente.id_expediente, 'APROBADO').subscribe({
          next: () => {
            this.loadExpedientes();
            this.notificacionService.mostrarMensaje(`Expediente ${expediente.numero_expediente} aprobado correctamente`, true, 'success');
          },
          error: (err) => {
            const msg = err.error?.error || 'Error al aprobar el expediente';
            this.notificacionService.mostrarMensaje(msg, true, 'error');
          }
        });
      }
    });
  }

  descargarDictamenes(expediente: any): void {
    this.expedienteService.getDatosParaDocumento(expediente.id_expediente).subscribe({
      next: (datos) => {
        const expedienteFormulario = this.convertirAFormulario(datos);
        this.pdfGenerator.generateDictamenesPDF(expedienteFormulario, datos.afts).subscribe({
          next: (blob) => this.saveBlob(blob, `dictamenes_${datos.numero_expediente}.pdf`),
          error: (err) => this.notificacionService.mostrarMensaje('Error generando PDF: ' + err, true, 'error')
        });
      },
      error: () => this.notificacionService.mostrarMensaje('Error al obtener datos', true, 'error')
    });
  }

  descargarMovimientos(expediente: any): void {
    this.expedienteService.getDatosParaDocumento(expediente.id_expediente).subscribe({
      next: (datos) => {
        const expedienteFormulario = this.convertirAFormulario(datos);
        this.pdfGenerator.generateMovimientosAgrupados(expedienteFormulario, datos.afts).subscribe({
          next: (blob) => this.saveBlob(blob, `movimientos_${datos.numero_expediente}.pdf`),
          error: (err) => this.notificacionService.mostrarMensaje('Error generando PDF: ' + err, true, 'error')
        });
      },
      error: () => this.notificacionService.mostrarMensaje('Error al obtener datos', true, 'error')
    });
  }

  descargarInformeResumen(expediente: any): void {
    this.expedienteService.getDatosParaDocumento(expediente.id_expediente).subscribe({
      next: (datos) => {
        const expedienteFormulario = this.convertirAFormulario(datos);
        this.pdfGenerator.generateInformeResumenPDF(expedienteFormulario, datos.afts).subscribe({
          next: (blob) => this.saveBlob(blob, `informe_resumen_${datos.numero_expediente}.pdf`),
          error: (err) => this.notificacionService.mostrarMensaje('Error generando PDF: ' + err, true, 'error')
        });
      },
      error: () => this.notificacionService.mostrarMensaje('Error al obtener datos', true, 'error')
    });
  }

  private convertirAFormulario(datos: any): ExpedienteFormulario {
    return {
      numero_expediente: datos.no_expediente,
      fecha_creacion: datos.fecha_creacion,
      estructura: datos.estructura,
      estructura_id: datos.estructura_id,
      centroCostoCodigo: datos.centroCostoCodigo,
      centroCostoNombre: datos.centroCostoNombre,
      direccionSolicita: datos.direccionSolicita,
      areaEntrega: datos.areaEntrega,
      areaRecibe: datos.areaRecibe,
      fechaActa: datos.fechaActa,
      horaActa: datos.horaActa,
      telefono: datos.telefono,
      nombreSolicitante: datos.nombreSolicitante,
      cargoSolicitante: datos.cargoSolicitante,
      nombreJefeAprueba: datos.nombreJefeAprueba,
      cargoJefeAprueba: datos.cargoJefeAprueba,
      jefeComision: datos.jefeComision,
      jefeComision_id: datos.jefeComision_id,
      miembro1: datos.miembro1,
      miembro2: datos.miembro2,
      miembro3: datos.miembro3,
      autorizado_por_id: datos.autorizado_por_id,
      aprobado_por_id: datos.aprobado_por_id,
      afts: datos.afts
    };
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }



  // Agregar estos métodos a la clase ExpedienteListComponent

  getNombreEstiloActual(): string {
    const estilo = this.estilosDisponibles.find(e => e.id === this.estiloActual);
    return estilo?.nombre || 'Estilo';
  }

  getInicialEstilo(nombre: string): string {
    // Tomar la primera letra de cada palabra o el primer carácter
    const palabras = nombre.split(' ');
    if (palabras.length >= 2 && (palabras[0] === 'Tarjetas' || palabras[0] === 'Vista')) {
      return palabras[0].charAt(0) + palabras[1].charAt(0);
    }
    return nombre.charAt(0);
  }
}