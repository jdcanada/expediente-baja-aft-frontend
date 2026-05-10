import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { MediobasicoService } from '../../../services/mediobasico/mediobasico.service';
import { AreaService } from '../../../services/area/area.service';
import { CaracteristicaService } from '../../../services/caracteristica/caracteristica.service';
import { ClasificacionService } from '../../../services/clasificacion/clasificacion.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-mediobasico-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './mediobasico-form.component.html',
  styleUrls: ['./mediobasico-form.component.css']
})
export class MediobasicoFormComponent implements OnInit {
  @Input() expedienteId!: number;
  @Output() abrirDrawer = new EventEmitter<any>();
  @Output() mediosActualizados = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  mediosBasicos: any[] = [];

  areas: any[] = [];
  caracteristicas: any[] = [];
  clasificaciones: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificacionService: NotificacionService,
    private medioBasicoService: MediobasicoService,
    private areaService: AreaService,
    private caracteristicaService: CaracteristicaService,
    private clasificacionService: ClasificacionService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      no_inventario: ['', Validators.required],
      aft: ['', Validators.required],
      area_id: ['', Validators.required],
      caracteristica_id: ['', Validators.required],
      clasificacion_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarMediosBasicos();
  }

  private cargarCatalogos(): void {
    this.areaService.listAll().subscribe({
      next: (data) => { this.areas = data; this.cdr.detectChanges(); },
      error: () => this.notificacionService.mostrarMensaje('Error al cargar áreas', true, 'error')
    });

    this.caracteristicaService.listAll().subscribe({
      next: (data) => { this.caracteristicas = data; this.cdr.detectChanges(); },
      error: () => this.notificacionService.mostrarMensaje('Error al cargar características', true, 'error')
    });

    this.clasificacionService.listAll().subscribe({
      next: (data) => { this.clasificaciones = data; this.cdr.detectChanges(); },
      error: () => this.notificacionService.mostrarMensaje('Error al cargar clasificaciones', true, 'error')
    });
  }


  protected cargarMediosBasicos(): void {
    if (!this.expedienteId) return;

    console.log('🔄 Cargando medios para expediente:', this.expedienteId);

    this.medioBasicoService.getByExpediente(this.expedienteId).subscribe({
      next: (data) => {
        console.log('📦 Medios recibidos del backend:', data);
        console.log('📦 Cantidad de medios:', data?.length);
        this.mediosBasicos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al cargar medios básicos:', err);
        this.notificacionService.mostrarMensaje('Error al cargar medios básicos', true, 'error');
      }
    });
  }

  // ✅ NUEVO: Actualizar un medio específico después de crear dictamen
  public actualizarMedioConDictamen(medioId: number, dictamenData: any): void {
    const index = this.mediosBasicos.findIndex(m => m.id_medio === medioId);
    if (index !== -1) {
      // Actualizar solo el medio específico
      this.mediosBasicos[index] = {
        ...this.mediosBasicos[index],
        dictamen: dictamenData,
        dictamen_id: dictamenData.id_dictamen
      };
      this.cdr.detectChanges(); // Solo actualiza el elemento modificado
    }
  }

  // ✅ NUEVO: Método público para recarga completa (solo si es necesario)
  public recargarListaCompleta(): void {
    this.cargarMediosBasicos();
  }


  resetForm(): void {
    this.form.reset();
    this.cdr.detectChanges();
  }

  eliminar(medio: any): void {
    this.notificacionService.confirmarAccion(`¿Eliminar el medio básico "${medio.no_inventario}"?`).then(confirmado => {
      if (confirmado) {
        this.medioBasicoService.delete(medio.id_medio).subscribe({
          next: () => {
            this.notificacionService.mostrarMensaje('Medio básico eliminado', true, 'success');
            this.cargarMediosBasicos();
            this.mediosActualizados.emit();
          },
          error: () => this.notificacionService.mostrarMensaje('Error al eliminar', true, 'error')
        });
      }
    });
  }

  crearDictamen(medio: any): void {
    console.log('Emitting abrirDrawer para medio:', medio);
    this.abrirDrawer.emit(medio);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificacionService.mostrarMensaje('Complete todos los campos requeridos', true, 'warning');
      return;
    }

    this.loading = true;
    const formValue = this.form.getRawValue();
    const currentUser = this.authService.getCurrentUser();

    const datosMedio = {
      no_inventario: formValue.no_inventario,
      aft: formValue.aft,
      expediente_id: this.expedienteId,
      area_id: formValue.area_id,
      caracteristica_id: formValue.caracteristica_id,
      clasificacion_id: formValue.clasificacion_id,
      created_by: currentUser?.id_usuario || 1,
      dictamen_id: null,
      movimiento_id: null
    };

    this.medioBasicoService.create(datosMedio).subscribe({
      next: (resp) => {
        this.loading = false;
        this.notificacionService.mostrarMensaje('Medio básico creado correctamente', true, 'success');
        this.resetForm();
        this.cargarMediosBasicos();
        this.mediosActualizados.emit();
      },
      error: (err) => {
        this.loading = false;
        // ✅ Manejar error de duplicado específicamente
        if (err.error?.code === 'DUPLICATE_INVENTORY' || err.status === 409) {
          this.notificacionService.mostrarMensaje(err.error?.error || 'Ya existe un medio con ese número de inventario', true, 'error');
        } else {
          this.notificacionService.mostrarMensaje('Error al crear medio básico: ' + err.message, true, 'error');
        }
      }
    });
  }
}