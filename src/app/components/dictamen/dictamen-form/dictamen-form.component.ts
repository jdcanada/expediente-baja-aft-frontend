import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { DictamenService } from '../../../services/dictamen/dictamen.service';
import { ExpedienteService } from '../../../services/expediente/expediente.service';
import { GrupoComisionService } from '../../../services/grupo-comision/grupo-comision.service';
import { CaracteristicaService } from '../../../services/caracteristica/caracteristica.service';
import { MediobasicoService } from '../../../services/mediobasico/mediobasico.service';
import { DestinoFinalService } from '../../../services/destino-final/destino-final.service';
import { GrupoComisionDetalle, MiembroGrupo } from '../../../models/grupoComision';
import { MediobasicoListItem } from '../../../models/medioBasico';
import { DictamenDetalle_new } from '../../../models/dictamen';

@Component({
  selector: 'app-dictamen-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './dictamen-form.component.html',
  styleUrls: ['./dictamen-form.component.css']
})
export class DictamenFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  esNuevo = true;

  mediosBasicos: MediobasicoListItem[] = [];
  expedientes: any[] = [];
  gruposComision: GrupoComisionDetalle[] = [];
  miembrosPorGrupo: MiembroGrupo[] = [];
  caracteristicas: any[] = [];
  destinosFinales: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DictamenFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificacionService: NotificacionService,
    private dictamenService: DictamenService,
    private medioBasicoService: MediobasicoService,
    // private expedienteService: ExpedienteService,
    private grupoComisionService: GrupoComisionService,
    private caracteristicaService: CaracteristicaService,
    private destinoFinalService: DestinoFinalService,
    private cdr: ChangeDetectorRef
  ) {
    this.esNuevo = !data || !data.id_dictamen;

    this.form = this.fb.group({
      id_dictamen: [null],
      no_dictamen: ['', Validators.required],
      medio_id: ['', Validators.required],
      grupo_id: ['', Validators.required],
      fecha_dictamen: [new Date().toISOString().split('T')[0], Validators.required],
      argumentacion_tecnica: ['', Validators.required],
      destino_final_id: [''],
      concluye_reparable: [false],
      caracteristica_id: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();

    // Si recibimos medioId (desde MediobasicoForm), setearlo en el formulario
    if (this.data?.medioId) {
      this.form.patchValue({ medio_id: this.data.medioId });
      this.esNuevo = true;
    }

    this.form.get('grupo_id')?.valueChanges.subscribe((grupoId: number) => {
      if (grupoId) {
        this.cargarMiembrosPorGrupo(grupoId);
      } else {
        this.miembrosPorGrupo = [];
      }
    });

    if (!this.esNuevo && this.data) {
      this.cargarDatosDictamen();
    }
  }

  cargarCatalogos(): void {
    this.medioBasicoService.listAll().subscribe({
      next: (data: MediobasicoListItem[]) => {
        this.mediosBasicos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar medios básicos', true, 'error');
      }
    });

    this.grupoComisionService.listAll().subscribe({
      next: (data: GrupoComisionDetalle[]) => {
        this.gruposComision = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar grupos de comisión', true, 'error');
      }
    });

    this.caracteristicaService.listAll().subscribe({
      next: (data: any[]) => {
        this.caracteristicas = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar características', true, 'error');
      }
    });

    this.destinoFinalService.listAll().subscribe({
      next: (data: any[]) => {
        this.destinosFinales = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar destinos finales', true, 'error');
      }
    });
  }

  cargarMiembrosPorGrupo(grupoId: number): void {
    this.grupoComisionService.getMiembrosByGrupo(grupoId).subscribe({
      next: (data: MiembroGrupo[]) => {
        this.miembrosPorGrupo = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar los miembros del grupo', true, 'error');
      }
    });
  }

  cargarDatosDictamen(): void {
    const id = this.data.id_dictamen;

    // ✅ Usar getDetalle en lugar de getById para obtener datos completos
    this.dictamenService.getDetalle(id).subscribe({
      next: (dictamen: DictamenDetalle_new) => {

        this.form.patchValue({
          id_dictamen: dictamen.id_dictamen,
          no_dictamen: dictamen.no_dictamen,
          medio_id: dictamen.mediobasico?.id_medio,
          grupo_id: dictamen.grupo?.id_grupo,
          fecha_dictamen: dictamen.fecha_dictamen?.split('T')[0] || new Date().toISOString().split('T')[0],
          argumentacion_tecnica: dictamen.argumentacion_tecnica,
          destino_final_id: dictamen.destino_final_id,
          concluye_reparable: !!dictamen.concluye_reparable,
          caracteristica_id: dictamen.mediobasico?.caracteristica?.id_caracteristica
        });

        if (dictamen.grupo?.id_grupo) {
          this.cargarMiembrosPorGrupo(dictamen.grupo.id_grupo);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.notificacionService.mostrarMensaje('Error al cargar datos del dictamen', true, 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificacionService.mostrarMensaje('Complete todos los campos requeridos', true, 'warning');
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    // Preparar miembros firmantes como JSON
    const miembrosFirmantes = this.miembrosPorGrupo.map(m => ({
      id_miembro: m.id_miembro,
      nombre: m.persona?.nombre || m.nombre || '',
      apellidos: m.persona?.apellidos || m.apellidos || '',
      es_responsable: m.es_responsable
    }));

    // ✅ Datos que espera el backend (solo los campos que existen en la tabla)
    const datosDictamen = {
      no_dictamen: formValue.no_dictamen,
      medio_id: formValue.medio_id,
      grupo_id: formValue.grupo_id,
      fecha_dictamen: formValue.fecha_dictamen,
      argumentacion_tecnica: formValue.argumentacion_tecnica,
      destino_final_id: formValue.destino_final_id || null,
      concluye_reparable: formValue.concluye_reparable ? 1 : 0,
      caracteristica_id: formValue.caracteristica_id || null,
      miembros_firmantes: JSON.stringify(miembrosFirmantes)
    };

    if (this.esNuevo) {
      this.dictamenService.create(datosDictamen).subscribe({
        next: () => {
          this.loading = false;
          this.notificacionService.mostrarMensaje('Dictamen creado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al crear:', err);
          this.notificacionService.mostrarMensaje('Error al crear dictamen: ' + err.message, true, 'error');
        }
      });
    } else {
      this.dictamenService.update(this.data.id_dictamen, datosDictamen).subscribe({
        next: () => {
          this.loading = false;
          this.notificacionService.mostrarMensaje('Dictamen actualizado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al actualizar:', err);
          this.notificacionService.mostrarMensaje('Error al actualizar dictamen: ' + err.message, true, 'error');
        }
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}