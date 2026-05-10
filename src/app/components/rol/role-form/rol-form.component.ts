import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { RoleService } from '../../../services/roles/role.service';
import { Rol } from '../../../models/role';

@Component({
  selector: 'app-rol-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.css']
})
export class RolFormComponent implements OnInit {
  isEditMode = false;
  rolId: number | null = null;
  errorMessage = '';
  isSaving = false;
  
  formData: { nombre_rol: string; descripcion: string } = {
    nombre_rol: '',
    descripcion: ''
  };

  constructor(
    private dialogRef: MatDialogRef<RolFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private notificacionService: NotificacionService
  ) {
    this.isEditMode = data && data.id_rol;
    if (this.isEditMode && data) {
      this.rolId = typeof data.id_rol === 'string' ? parseInt(data.id_rol, 10) : data.id_rol;
      this.formData = {
        nombre_rol: data.nombre_rol || '',
        descripcion: data.descripcion || ''
      };
    }
  }

  ngOnInit(): void {
    if (this.isEditMode && this.rolId) {
      this.cargarRol();
    }
  }

  private cargarRol(): void {
    this.roleService.getById(this.rolId!).subscribe({
      next: (rol: Rol) => {
        this.formData = {
          nombre_rol: rol.nombre_rol || '',
          descripcion: rol.descripcion || ''
        };
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar el rol', true, 'error');
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.nombre_rol || this.formData.nombre_rol.trim() === '') {
      this.errorMessage = 'El nombre del rol es requerido';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.rolId) {
      this.roleService.update(this.rolId, this.formData as Rol).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificacionService.mostrarMensaje('Rol actualizado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Error al actualizar el rol';
        }
      });
    } else {
      this.roleService.create(this.formData as Rol).subscribe({
        next: () => {
          this.isSaving = false;
          this.notificacionService.mostrarMensaje('Rol creado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Error al crear el rol';
        }
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}