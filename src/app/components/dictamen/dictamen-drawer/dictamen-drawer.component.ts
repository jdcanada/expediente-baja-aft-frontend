import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { DictamenService } from '../../../services/dictamen/dictamen.service';
import { GrupoComisionService } from '../../../services/grupo-comision/grupo-comision.service';
import { DestinoFinalService } from '../../../services/destino-final/destino-final.service';
import { GrupoComisionDetalle, MiembroGrupo } from '../../../models/grupoComision';

@Component({
  selector: 'app-dictamen-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './dictamen-drawer.component.html',
  styleUrls: ['./dictamen-drawer.component.css']
})
export class DictamenDrawerComponent implements OnInit {
  @Input() medioId!: number;
  @Input() expedienteId!: number;
  @Input() medio: any;
  @Output() close = new EventEmitter<void>();
  @Output() dictamenCreado = new EventEmitter<any>();

  loading = false;

  formData = {
    no_dictamen: '',
    grupo_id: null,
    fecha_dictamen: new Date().toISOString().split('T')[0],
    argumentacion_tecnica: '',
    destino_final_id: null,
    concluye_reparable: false
  };

  gruposComision: GrupoComisionDetalle[] = [];
  miembrosPorGrupo: MiembroGrupo[] = [];
  destinosFinales: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private notificacionService: NotificacionService,
    private dictamenService: DictamenService,
    private grupoComisionService: GrupoComisionService,
    private destinoFinalService: DestinoFinalService
  ) { }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  private cargarCatalogos(): void {
    this.grupoComisionService.listAll().subscribe({
      next: (data) => { this.gruposComision = data; this.cdr.detectChanges(); },
      error: () => this.notificacionService.mostrarMensaje('Error al cargar grupos de comisión', true, 'error')
    });

    this.destinoFinalService.listAll().subscribe({
      next: (data) => { this.destinosFinales = data; this.cdr.detectChanges(); },
      error: () => this.notificacionService.mostrarMensaje('Error al cargar destinos finales', true, 'error')
    });
  }

  onGrupoChange(): void {
    if (this.formData.grupo_id) {
      this.grupoComisionService.getMiembrosByGrupo(this.formData.grupo_id).subscribe({
        next: (data) => {
          this.miembrosPorGrupo = data;
          this.cdr.detectChanges();
        },
        error: () => this.notificacionService.mostrarMensaje('Error al cargar miembros del grupo', true, 'error')
      });
    } else {
      this.miembrosPorGrupo = [];
    }
  }

  cerrarDrawer(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (!this.formData.no_dictamen || !this.formData.grupo_id || !this.formData.argumentacion_tecnica || !this.formData.destino_final_id) {
      this.notificacionService.mostrarMensaje('Complete todos los campos requeridos', true, 'warning');
      return;
    }

    this.loading = true;

    const miembrosFirmantes = this.miembrosPorGrupo.map(m => ({
      id_miembro: m.id_miembro,
      nombre: m.persona?.nombre || m.nombre || '',
      apellidos: m.persona?.apellidos || m.apellidos || '',
      es_responsable: m.es_responsable
    }));

    const datosDictamen = {
      no_dictamen: this.formData.no_dictamen,
      medio_id: this.medioId,
      grupo_id: this.formData.grupo_id,
      fecha_dictamen: this.formData.fecha_dictamen,
      argumentacion_tecnica: this.formData.argumentacion_tecnica,
      destino_final_id: this.formData.destino_final_id,
      concluye_reparable: this.formData.concluye_reparable ? 1 : 0,
      miembros_firmantes: JSON.stringify(miembrosFirmantes)
    };

    this.dictamenService.create(datosDictamen).subscribe({
      next: (resp) => {
        this.loading = false;
        this.notificacionService.mostrarMensaje('Dictamen creado correctamente', true, 'success');

        // ✅ Emitir el ID del medio y los datos del dictamen para actualización selectiva
        this.dictamenCreado.emit({
          medioId: this.medioId,
          dictamenData: {
            id_dictamen: resp.id_dictamen,
            no_dictamen: this.formData.no_dictamen,
            fecha_dictamen: this.formData.fecha_dictamen,
            argumentacion_tecnica: this.formData.argumentacion_tecnica,
            destino_final: this.destinosFinales.find(d => d.id_destino === this.formData.destino_final_id)?.descripcion,
            concluye_reparable: this.formData.concluye_reparable
          }
        });

        this.cerrarDrawer();
      },
      error: (err) => {
        this.loading = false;
        this.notificacionService.mostrarMensaje('Error al crear dictamen: ' + err.message, true, 'error');
      }
    });
  }
}