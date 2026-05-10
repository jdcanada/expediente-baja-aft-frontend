import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { DirectivoService } from '../../../services/directivo/directivo.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { CargoService } from '../../../services/cargo/cargo.service';
import { EstructuraService } from '../../../services/estructura/estructura.service';
import { Directivo, DirectivoDetalle } from '../../../models/directivo';
import { PersonaListItem2 } from '../../../models/persona';
import { Cargo } from '../../../models/cargo';
import { Estructura } from '../../../models/estructura';

@Component({
  selector: 'app-directivo-form',
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
    MatSelectModule
  ],
  templateUrl: './directivo-form.component.html',
  styleUrls: ['./directivo-form.component.css']
})
export class DirectivoForm implements OnInit {
  form: FormGroup;
  loading = false;
  esNuevo = true;
  
  // Listas para los selects
  personas: PersonaListItem2[] = [];
  cargos: Cargo[] = [];
  estructuras: Estructura[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DirectivoForm>,
    @Inject(MAT_DIALOG_DATA) public data: DirectivoDetalle | null,
    private notificacionService: NotificacionService,
    private directivoService: DirectivoService,
    private personaService: PersonaService,
    private cargoService: CargoService,
    private estructuraService: EstructuraService
  ) {
    this.esNuevo = !data || !data.id_directivo;
    
    this.form = this.fb.group({
      id_directivo: [null],
      persona_id: ['', Validators.required],
      telefono_corporativo: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    
    if (!this.esNuevo && this.data) {
      this.cargarDatosDirectivo();
    }
  }

  cargarCatalogos(): void {
    // Cargar personas (solo directivas)
    this.personaService.getDirectivos().subscribe({
      next: (data) => {
        this.personas = data;
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar personas', true, 'error');
      }
    });

    // Cargar cargos (solo directivos)
    this.cargoService.getAll().subscribe({
      next: (data) => {
        this.cargos = data.filter(c => c.es_directivo === true);
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar cargos', true, 'error');
      }
    });

    // Cargar estructuras
    this.estructuraService.getAllSimple().subscribe({
      next: (data) => {
        this.estructuras = data;
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar estructuras', true, 'error');
      }
    });
  }

  cargarDatosDirectivo(): void {
    if (!this.data) return;
    
    const id = this.data.id_directivo;
    this.directivoService.getById(id).subscribe({
      next: (directivo) => {
        this.form.patchValue({
          id_directivo: directivo.id_directivo,
          persona_id: directivo.persona?.id_persona,
          telefono_corporativo: directivo.telefono_corporativo
        });
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar datos del directivo', true, 'error');
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

    if (this.esNuevo) {
      // Crear nuevo directivo
      const nuevoDirectivo: Directivo = {
        id_directivo: 0,
        persona_id: formValue.persona_id,
        telefono_corporativo: formValue.telefono_corporativo || null
      };

      this.directivoService.create(nuevoDirectivo).subscribe({
        next: () => {
          this.loading = false;
          this.notificacionService.mostrarMensaje('Directivo creado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.notificacionService.mostrarMensaje('Error al crear directivo: ' + err.message, true, 'error');
        }
      });
    } else {
      // Actualizar directivo existente - solo enviamos los campos que podemos actualizar
      const id = this.data?.id_directivo || 0;
      
      // Para actualizar, solo necesitamos enviar el ID y el teléfono
      // El backend se encargará de actualizar solo ese campo
      const datosActualizados = {
        telefono_corporativo: formValue.telefono_corporativo || null
      };

      this.directivoService.update(id, datosActualizados as any).subscribe({
        next: () => {
          this.loading = false;
          this.notificacionService.mostrarMensaje('Directivo actualizado correctamente', true, 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading = false;
          this.notificacionService.mostrarMensaje('Error al actualizar directivo: ' + err.message, true, 'error');
        }
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}