import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpedienteService } from '../../../services/expediente/expediente.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { Router } from '@angular/router';
import { ExpedienteDetalle_3 } from '../../../models/expediente';

@Component({
  selector: 'app-expediente-detalle',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './expediente-detalle.component.html',
  styleUrls: ['./expediente-detalle.component.css']
})
export class ExpedienteDetalleComponent {
  activeTab: 'info' | 'medios' | 'dictamenes' | 'movimientos' = 'info';
  validacion: any = null;
  isGenerandoMovimientos = false;
  puedeCompletar = false;
  puedeAprobar = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public expediente: ExpedienteDetalle_3,
    private expedienteService: ExpedienteService,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private dialogRef: MatDialogRef<ExpedienteDetalleComponent>,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarValidacion();
    this.actualizarPermisos();
    this.cargarExpedienteActualizado();
  }

  private actualizarPermisos(): void {
    // Completar expediente (generar movimientos)
    this.puedeCompletar = this.expedienteService.puedeCompletarse(this.expediente) &&
      this.authService.hasPermission('expedientes.editar');

    // Aprobar expediente (solo si no está aprobado y tiene movimientos)
    this.puedeAprobar = this.expediente.estado !== 'APROBADO' &&
      (this.expediente.total_movimientos || 0) > 0 &&
      this.expedienteService.puedeAprobar(this.expediente) &&
      this.authService.hasPermission('expedientes.aprobar');
  }

  setActiveTab(tab: 'info' | 'medios' | 'dictamenes' | 'movimientos'): void {
    this.activeTab = tab;
  }

  irACompletar(): void {
    this.dialogRef.close();
    this.router.navigate(['/cargar'], {
      queryParams: { expediente: this.expediente.id_expediente }
    });
  }

  cargarValidacion(): void {
    this.expedienteService.getValidacion(this.expediente.id_expediente!).subscribe({
      next: (data) => {
        this.validacion = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar validación:', err);
      }
    });
  }

  completarExpediente(): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de completar el expediente "${this.expediente.numero_expediente}"?\n\n` +
      `Se generarán automáticamente los movimientos agrupando los ${this.expediente.total_medios || 0} medios básicos por clasificación y área.`,
      'Completar Expediente',
      'warning',
      'Sí, completar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {
        this.isGenerandoMovimientos = true;

        this.expedienteService.generarMovimientosAutomaticos(this.expediente.id_expediente!).subscribe({
          next: (resp) => {
            this.isGenerandoMovimientos = false;
            this.notificacionService.mostrarMensaje(
              resp.message || `Expediente completado con ${resp.total_movimientos} movimientos`,
              true,
              'success'
            );
            this.cargarExpedienteActualizado();
          },
          error: (err) => {
            this.isGenerandoMovimientos = false;
            const msg = err.error?.error || 'Error al generar movimientos';
            this.notificacionService.mostrarMensaje(msg, true, 'error');
          }
        });
      }
    });
  }

  aprobarExpediente(): void {
    if (this.expediente.estado === 'APROBADO') {
      this.notificacionService.mostrarMensaje('El expediente ya está aprobado', true, 'warning');
      return;
    }

    if (!this.expedienteService.puedeAprobar(this.expediente)) {
      this.notificacionService.mostrarMensaje('No tiene permisos para aprobar este expediente', true, 'error');
      return;
    }

    this.notificacionService.confirmarAccion(
      `⚠️ Una vez aprobado, NO se podrá modificar ni eliminar.\n\n` +
      `¿Está seguro de APROBAR el expediente "${this.expediente.numero_expediente}"?`,
      'Aprobar Expediente',
      'warning',
      'Sí, Aprobar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {
        this.expedienteService.cambiarEstado(this.expediente.id_expediente!, 'APROBADO').subscribe({
          next: () => {
            this.notificacionService.mostrarMensaje(
              `Expediente ${this.expediente.numero_expediente} aprobado correctamente`,
              true,
              'success'
            );
            this.cargarExpedienteActualizado();
          },
          error: (err) => {
            const msg = err.error?.error || 'Error al aprobar el expediente';
            this.notificacionService.mostrarMensaje(msg, true, 'error');
          }
        });
      }
    });
  }

  private cargarExpedienteActualizado(): void {
    this.expedienteService.getByIdDetalle(this.expediente.id_expediente!).subscribe({
      next: (data) => {
        console.log(data);
        Object.assign(this.expediente, data);
        this.actualizarPermisos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error recargando expediente:', err);
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}