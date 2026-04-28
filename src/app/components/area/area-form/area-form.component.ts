import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Area } from '../../../models/area';
import { AreaService } from '../../../services/area/area.service';
import { EstructuraService } from '../../../services/estructura/estructura.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Estructura, Estructura_Areas_Personas } from '../../../models/estructura';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ]
})
export class AreaForm implements OnInit {
  form!: FormGroup;
  estructuras: Estructura_Areas_Personas[] = [];
  isEdit = false;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Area | null,
    private dialogRef: MatDialogRef<AreaForm>,
    private fb: FormBuilder,
    private areaService: AreaService,
    private estructuraService: EstructuraService,
    private notificacion: NotificacionService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo_area: [''],
      nombre_area: ['', [Validators.required]],
      estructura_id: [null, [Validators.required]]
    });

    this.isEdit = !!this.data;

    // Carga de estructuras para select
    this.estructuraService.listAll().subscribe({
      next: (estructuras) => (this.estructuras = estructuras)
    });

    // Si es edición, carga datos
    if (this.data) {
      this.form.patchValue({
        codigo_area: this.data.codigo_area,
        nombre_area: this.data.nombre_area,
        estructura_id: this.data.estructura_id
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const value = this.form.value as Area;
    const op = this.isEdit
      ? this.areaService.update(this.data!.idarea!, value)
      : this.areaService.create(value);

    op.subscribe({
      next: () => {
        this.notificacion.mostrarMensaje(
          this.isEdit ? 'Área actualizada correctamente' : 'Área creada correctamente',
          true,
          'success'
        );
        this.dialogRef.close(true);
        this.loading = false;
      },
      error: () => {
        this.notificacion.mostrarMensaje(
          'Error al guardar el área',
          true,
          'error'
        );
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
