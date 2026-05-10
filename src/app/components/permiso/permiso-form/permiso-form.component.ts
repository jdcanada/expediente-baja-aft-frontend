import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { PermisoService } from '../../../services/permiso/permiso.service';

@Component({
  selector: 'app-permiso-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './permiso-form.component.html',
  styleUrls: ['./permiso-form.component.css']
})
export class PermisoFormComponent implements OnInit {
  isEditMode = false;
  permisoId: number | null = null;
  errorMessage = '';
  isSaving = false;
  isLoadingModulos = true;
  
  modulosDisponibles: string[] = [];

  formData = {
    codigo: '',
    nombre: '',
    descripcion: '',
    modulo: ''
  };

  constructor(
    private dialogRef: MatDialogRef<PermisoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permisoService: PermisoService,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef  // ✅ Agregar ChangeDetectorRef
  ) {
    this.isEditMode = data && data.id_permiso;
    if (this.isEditMode && data) {
      this.permisoId = data.id_permiso;
      this.formData = {
        codigo: data.codigo || '',
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        modulo: data.modulo || ''
      };
    }
    // ✅ NO asignar data.modulo aquí - mover a ngOnInit
  }

  ngOnInit(): void {
    // ✅ Cargar módulos ANTES de asignar el valor
    this.cargarModulos();
  }

  private cargarModulos(): void {
    this.isLoadingModulos = true;
    this.permisoService.getModulos().subscribe({
      next: (modulos) => {
        this.modulosDisponibles = modulos;
        this.isLoadingModulos = false;
        
        // ✅ Asignar el módulo DESPUÉS de que los módulos estén cargados
        if (!this.isEditMode && this.data && this.data.modulo) {
          this.formData.modulo = this.data.modulo;
        }
        
        this.cdr.detectChanges(); // ✅ Forzar detección de cambios
      },
      error: () => {
        this.isLoadingModulos = false;
        this.modulosDisponibles = [
          'expedientes', 'dictamenes', 'movimientos', 'catalogos',
          'comisiones', 'seguridad', 'reportes', 'configuracion', 'medios',
          'personas', 'cargos', 'areas', 'estructuras'
        ];
        
        if (!this.isEditMode && this.data && this.data.modulo) {
          this.formData.modulo = this.data.modulo;
        }
        
        this.cdr.detectChanges();
        this.notificacionService.mostrarMensaje('Error al cargar módulos, usando lista por defecto', true, 'warning');
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.codigo || !this.formData.nombre || !this.formData.modulo) {
      this.errorMessage = 'Complete todos los campos requeridos';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.permisoId) {
      this.permisoService.update(this.permisoId, this.formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificacionService.mostrarMensaje('Permiso actualizado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Error al actualizar el permiso';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.permisoService.create(this.formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificacionService.mostrarMensaje('Permiso creado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Error al crear el permiso';
          this.cdr.detectChanges();
        }
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}