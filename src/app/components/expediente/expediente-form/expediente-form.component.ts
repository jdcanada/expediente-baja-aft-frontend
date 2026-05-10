import { Component, Output, EventEmitter, ChangeDetectorRef, NgZone, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpedienteFormulario } from '../../../models/expedienteformulario';
import { EstructuraService } from '../../../services/estructura/estructura.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { PersonaListItem2 } from '../../../models/persona';
import { Estructura_Areas_Personas } from '../../../models/estructura';
import { ComisionmiembrosService } from '../../../services/comisionmiembros/comisionmiembros.service';
import { ComisionMiembroDetalle, JefeComision } from '../../../models/comisionMiembro';
import { GrupoComision2 } from '../../../models/grupoComision';
import { ExpedienteService } from '../../../services/expediente/expediente.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Expediente } from '../../../models/expediente';
import { MediobasicoFormComponent } from '../../mediobasico/mediobasico-form/mediobasico-form.component';
import { DictamenDrawerComponent } from '../../dictamen/dictamen-drawer/dictamen-drawer.component';

@Component({
  selector: 'app-expediente-form',
  standalone: true,
  templateUrl: './expediente-form.component.html',
  styleUrls: ['./expediente-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MediobasicoFormComponent,
    DictamenDrawerComponent
  ],
})
export class ExpedienteFormComponent {
  @Output() formCompleted = new EventEmitter<ExpedienteFormulario>();
  @ViewChild(MediobasicoFormComponent) mediobasicoForm!: MediobasicoFormComponent;

  // Pestañas
  activeTab: 'expediente' | 'solicitante' | 'aprobacion' | 'comision' | 'areas' | 'aft' = 'expediente';

  form: FormGroup;
  isEditMode = false;
  expedienteId: number | null = null;
  loading = false;

  estructuras: Estructura_Areas_Personas[] = [];
  personasDirectivas: PersonaListItem2[] = [];
  comisionmiembros: ComisionMiembroDetalle[] = [];
  jefesComisiones: JefeComision[] = [];

  // Para el drawer global
  mostrarDrawerGlobal = false;
  medioSeleccionadoGlobal: any = null;

  constructor(
    private fb: FormBuilder,
    private estructuraService: EstructuraService,
    private personaService: PersonaService,
    private comisionmiembrosService: ComisionmiembrosService,
    private expedienteService: ExpedienteService,
    private notificacionService: NotificacionService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    @Optional() protected dialogRef?: MatDialogRef<ExpedienteFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.isEditMode = data && data.id_expediente;
    this.expedienteId = this.isEditMode ? data.id_expediente : null;

    this.form = this.fb.group({
      numero_expediente: ['', Validators.required],
      fecha_creacion: ['', Validators.required],
      estructura_id: ['', Validators.required],
      centroCostoCodigo: [{ value: '', disabled: true }],
      centroCostoNombre: [{ value: '', disabled: true }],
      nombreSolicitante: ['', Validators.required],
      cargoSolicitante: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      nombreJefeAprueba: ['', Validators.required],
      cargoJefeAprueba: [{ value: '', disabled: true }],
      jefeComision: ['', Validators.required],
      miembro1: [''],
      miembro2: [''],
      miembro3: [''],
      miembro4: [''],
      direccionSolicita: [{ value: '', disabled: true }],
      areaEntrega: [{ value: '', disabled: true }],
      areaRecibe: ['Dirección de Servicios Generales', Validators.required],
      fechaActa: [''],
      horaActa: ['']
    });

    this.loadEstructuras();
    this.loadPersonasDirectivas();
    this.loadComisionesMiembros();
    this.loadJefesComisiones();

    this.form.get('estructura_id')?.valueChanges.subscribe(id_estructura => {
      this.onEstructuraSelected(id_estructura);
    });

    this.form.get('nombreSolicitante')?.valueChanges.subscribe(id_persona => {
      this.onSolicitanteSelected(id_persona);
    });

    this.form.get('nombreJefeAprueba')?.valueChanges.subscribe(id_persona => {
      this.onJefeApruebaSelected(id_persona);
    });

    this.form.get('jefeComision')?.valueChanges.subscribe(idjefeComision => {
      this.onComisionSelected(idjefeComision);
    });

    if (this.isEditMode && this.expedienteId) {
      this.cargarDatosExpediente();
    }
  }

  // ============================================
  // NAVEGACIÓN ENTRE PESTAÑAS
  // ============================================

  setActiveTab(tab: 'expediente' | 'solicitante' | 'aprobacion' | 'comision' | 'areas' | 'aft'): void {
    this.activeTab = tab;
  }

  nextTab(): void {
    if (!this.validateCurrentTab()) return;

    switch (this.activeTab) {
      case 'expediente': this.activeTab = 'solicitante'; break;
      case 'solicitante': this.activeTab = 'aprobacion'; break;
      case 'aprobacion': this.activeTab = 'comision'; break;
      case 'comision': this.activeTab = 'areas'; break;
      case 'areas': this.activeTab = 'aft'; break;
      case 'aft': this.submitForm(); break;
    }
  }

  prevTab(): void {
    switch (this.activeTab) {
      case 'solicitante': this.activeTab = 'expediente'; break;
      case 'aprobacion': this.activeTab = 'solicitante'; break;
      case 'comision': this.activeTab = 'aprobacion'; break;
      case 'areas': this.activeTab = 'comision'; break;
      case 'aft': this.activeTab = 'areas'; break;
    }
  }

  isLastTab(): boolean {
    return this.activeTab === 'aft';
  }

  private validateCurrentTab(): boolean {
    switch (this.activeTab) {
      case 'expediente':
        const valid = this.form.get('numero_expediente')?.valid &&
          this.form.get('fecha_creacion')?.valid &&
          this.form.get('estructura_id')?.valid;
        if (!valid) {
          this.notificacionService.mostrarMensaje('Complete los datos del expediente', true, 'warning');
        }
        return valid === true;

      case 'solicitante':
        if (!this.form.get('nombreSolicitante')?.valid) {
          this.notificacionService.mostrarMensaje('Seleccione un solicitante', true, 'warning');
          return false;
        }
        return true;

      case 'aprobacion':
        if (!this.form.get('nombreJefeAprueba')?.valid) {
          this.notificacionService.mostrarMensaje('Seleccione un jefe que aprueba', true, 'warning');
          return false;
        }
        return true;

      case 'comision':
        if (!this.form.get('jefeComision')?.valid) {
          this.notificacionService.mostrarMensaje('Seleccione un jefe de comisión', true, 'warning');
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  // ============================================
  // CARGA DE DATOS
  // ============================================

  loadEstructuras() {
    this.estructuraService.listAll().subscribe(data => {
      this.ngZone.run(() => {
        this.estructuras = data;
        this.cdRef.detectChanges();
      });
    });
  }

  loadPersonasDirectivas() {
    this.personaService.getDirectivos().subscribe(data => {
      this.personasDirectivas = data;
      this.cdRef.detectChanges();
    });
  }

  loadComisionesMiembros() {
    this.comisionmiembrosService.listAll().subscribe(data => {
      this.comisionmiembros = data;
      this.cdRef.detectChanges();
    });
  }

  loadJefesComisiones() {
    this.comisionmiembrosService.getJefescomisiones().subscribe(data => {
      this.jefesComisiones = data;
      this.cdRef.detectChanges();
    });
  }

  cargarDatosExpediente(): void {
    if (!this.expedienteId) return;

    this.expedienteService.getById(this.expedienteId).subscribe({
      next: (expediente: any) => {
        const estructuraId = expediente.estructura_id;
        const solicitanteId = expediente.directivo_solicita_id;
        const jefeApruebaId = expediente.aprobado_por_id;
        const jefeComisionId = expediente.jefe_comision_id;

        this.form.patchValue({
          numero_expediente: expediente.numero_expediente,
          fecha_creacion: expediente.fecha_creacion?.split('T')[0],
          estructura_id: estructuraId,
          nombreSolicitante: solicitanteId,
          nombreJefeAprueba: jefeApruebaId,
          jefeComision: jefeComisionId
        });

        this.cdRef.detectChanges();

        if (estructuraId) this.onEstructuraSelected(estructuraId);
        if (solicitanteId) this.onSolicitanteSelected(solicitanteId);
        if (jefeApruebaId) this.onJefeApruebaSelected(jefeApruebaId);
        if (jefeComisionId) setTimeout(() => this.onComisionSelected(jefeComisionId), 100);
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.notificacionService.mostrarMensaje('Error al cargar datos del expediente', true, 'error');
      }
    });
  }

  // ============================================
  // EVENTOS DE SELECCIÓN
  // ============================================

  onEstructuraSelected(id: number) {
    const estructura = this.estructuras.find(e => e.id_estructura == id);
    if (estructura) {
      this.form.patchValue({
        centroCostoCodigo: estructura.codigo_centro_costo,
        centroCostoNombre: estructura.nombre_estructura,
        direccionSolicita: estructura.nombre_estructura,
        areaEntrega: estructura.nombre_estructura
      });
    }
  }

  onSolicitanteSelected(id_persona: number) {
    const persona = this.personasDirectivas.find(p => p.id_persona == id_persona);
    if (persona) {
      this.form.patchValue({
        cargoSolicitante: persona.nombre_cargo,
        telefono: persona.telefono || ''
      });
    }
  }

  onJefeApruebaSelected(id_persona: number) {
    const persona = this.personasDirectivas.find(p => p.id_persona == id_persona);
    if (persona) {
      this.form.patchValue({
        cargoJefeAprueba: persona.nombre_cargo
      });
    }
  }

  onComisionSelected(idjefeComision: number) {
    if (!idjefeComision) {
      this.form.patchValue({ miembro1: '', miembro2: '', miembro3: '', miembro4: '' });
      return;
    }

    this.comisionmiembrosService.getById(idjefeComision).subscribe({
      next: res => {
        const id_grupo = res.grupo_id;
        if (id_grupo) {
          this.comisionmiembrosService.MiembrosPorGrupo(id_grupo).subscribe({
            next: (grupo: GrupoComision2) => {
              if (grupo?.miembros) {
                this.form.patchValue({
                  miembro1: grupo.miembros[1] ? `${grupo.miembros[1].persona.nombre} ${grupo.miembros[1].persona.apellidos}` : '',
                  miembro2: grupo.miembros[2] ? `${grupo.miembros[2].persona.nombre} ${grupo.miembros[2].persona.apellidos}` : '',
                  miembro3: grupo.miembros[3] ? `${grupo.miembros[3].persona.nombre} ${grupo.miembros[3].persona.apellidos}` : '',
                  miembro4: grupo.miembros[4] ? `${grupo.miembros[4].persona.nombre} ${grupo.miembros[4].persona.apellidos}` : ''
                });
              }
            }
          });
        }
      }
    });
  }

  // ============================================
  // MÉTODOS DEL DRAWER GLOBAL
  // ============================================

  abrirDrawerDictamen(medio: any): void {
    console.log('Abriendo drawer desde expediente-form:', medio);
    this.medioSeleccionadoGlobal = medio;
    this.mostrarDrawerGlobal = true;
    this.cdRef.detectChanges();
  }

  cerrarDrawerGlobal(): void {
    console.log('Cerrando drawer desde expediente-form');
    this.mostrarDrawerGlobal = false;
    this.medioSeleccionadoGlobal = null;
    this.cdRef.detectChanges();
  }

  onDictamenCreadoGlobal(result: any): void {
    if (result) {
      this.notificacionService.mostrarMensaje('Dictamen creado correctamente', true, 'success');

      // ✅ Actualizar SOLO el medio modificado, no toda la lista
      if (this.mediobasicoForm && result.medioId && result.dictamenData) {
        this.mediobasicoForm.actualizarMedioConDictamen(result.medioId, result.dictamenData);
      } else if (this.mediobasicoForm) {
        // Fallback: recargar lista completa si no tenemos los datos específicos
        this.mediobasicoForm.recargarListaCompleta();
      }

      this.cerrarDrawerGlobal();
      this.cdRef.detectChanges();
    }
  }

  // ============================================
  // ENVÍO DEL FORMULARIO
  // ============================================

  resetForm() {
    this.form.reset({
      areaRecibe: 'Dirección de Servicios Generales'
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.cdRef.detectChanges();
  }

  cerrar(): void {
    if (this.dialogRef) this.dialogRef.close(false);
  }

  onMediosActualizados(): void {
    console.log('Medios actualizados, refrescando vista');
    this.cdRef.detectChanges();
  }

  submitForm() {
    console.log('🔴 submitForm ejecutado - guardando expediente');

    if (this.form.invalid) {
      this.notificacionService.mostrarMensaje('Complete todos los campos requeridos', true, 'warning');
      return;
    }

    this.loading = true;
    const formValue = this.form.getRawValue();

    const estructuraId = formValue.estructura_id;
    const nombreSolicitanteId = formValue.nombreSolicitante;
    const nombreJefeApruebaId = formValue.nombreJefeAprueba;
    const jefeComisionId = formValue.jefeComision;

    if (!estructuraId || !nombreSolicitanteId || !nombreJefeApruebaId || !jefeComisionId) {
      this.loading = false;
      this.notificacionService.mostrarMensaje('Complete todos los campos requeridos', true, 'warning');
      return;
    }

    const estructuraSeleccionada = this.estructuras.find(e => e.id_estructura === Number(estructuraId));
    const area_id = estructuraSeleccionada?.areas?.[0]?.id_area || 1;
    const currentUser = this.authService.getCurrentUser();

    const expedienteData: Expediente = {
      numero_expediente: formValue.numero_expediente,
      fecha_creacion: formValue.fecha_creacion,
      estructura_id: Number(estructuraId),
      area_id: area_id,
      directivo_solicita_id: Number(nombreSolicitanteId),
      autorizado_por_id: Number(nombreSolicitanteId),
      aprobado_por_id: Number(nombreJefeApruebaId),
      jefe_comision_id: Number(jefeComisionId),
      causas_generales: 'El deterioro por rotura, por lo cual no están aptos para su uso',
      creado_por_id: currentUser?.id_usuario || 1
    };

    if (this.dialogRef) {
      if (this.isEditMode && this.expedienteId) {
        this.expedienteService.update(this.expedienteId, expedienteData as any).subscribe({
          next: () => {
            this.loading = false;
            this.notificacionService.mostrarMensaje('Expediente actualizado correctamente', true, 'success');
            this.dialogRef!.close(true);
          },
          error: (err) => {
            this.loading = false;
            this.notificacionService.mostrarMensaje('Error al actualizar: ' + err.message, true, 'error');
          }
        });
      } else {
        this.expedienteService.create(expedienteData).subscribe({
          next: (resp) => {
            this.loading = false;
            this.expedienteId = resp.id_expediente;
            this.notificacionService.mostrarMensaje('Expediente creado correctamente', true, 'success');
            this.cdRef.detectChanges();
          },
          error: (err) => {
            this.loading = false;
            this.notificacionService.mostrarMensaje('Error al crear: ' + err.message, true, 'error');
          }
        });
      }
    } else {
      const expedienteFormData: ExpedienteFormulario = {
        numero_expediente: formValue.numero_expediente,
        fecha_creacion: formValue.fecha_creacion,
        estructura_id: Number(estructuraId),
        estructura: estructuraSeleccionada?.nombre_estructura || '',
        centroCostoCodigo: formValue.centroCostoCodigo,
        centroCostoNombre: formValue.centroCostoNombre,
        direccionSolicita: formValue.direccionSolicita,
        areaEntrega: formValue.areaEntrega,
        areaRecibe: formValue.areaRecibe,
        nombreSolicitante: this.personasDirectivas.find(p => p.id_persona === Number(nombreSolicitanteId))?.nombre || '',
        cargoSolicitante: formValue.cargoSolicitante,
        telefono: formValue.telefono,
        nombreJefeAprueba: this.personasDirectivas.find(p => p.id_persona === Number(nombreJefeApruebaId))?.nombre || '',
        cargoJefeAprueba: formValue.cargoJefeAprueba,
        jefeComision: this.jefesComisiones.find(j => j.id_miembro === Number(jefeComisionId))?.persona.nombre || '',
        jefeComision_id: Number(jefeComisionId),
        autorizado_por_id: Number(nombreSolicitanteId),
        aprobado_por_id: Number(nombreJefeApruebaId),
        miembro1: formValue.miembro1,
        miembro2: formValue.miembro2,
        miembro3: formValue.miembro3,
        miembro4: formValue.miembro4,
        fechaActa: formValue.fechaActa,
        horaActa: formValue.horaActa,
        afts: []
      };
      this.formCompleted.emit(expedienteFormData);
      this.loading = false;
    }
  }
}