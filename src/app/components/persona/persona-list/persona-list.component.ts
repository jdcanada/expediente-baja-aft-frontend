import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PersonaListItem, EditableCellPersona } from '../../../models/persona';
import { PersonaService } from '../../../services/persona/persona.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { PersonaFormComponent } from '../persona-form/persona-form.component';

@Component({
  standalone: true,
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class PersonaList implements OnInit, AfterViewInit {
  personas: PersonaListItem[] = [];
  displayedColumns: string[] = [
    'solapin',
    'nombre',
    'apellidos',
    'correo',
    'nombre_cargo',
    'nombre_estructura',
    'acciones'
  ];
  dataSource = new MatTableDataSource<PersonaListItem>([]);
  loading = false;
  searchTerm = '';

  editingCell: EditableCellPersona | null = null;
  tempValue = '';
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }

  ngAfterViewInit(): void {
    
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
      //this.cdr.detectChanges();
    
  }

  cargarPersonas(): void {
    this.loading = true;
    this.personaService.listAll().subscribe({
      next: (data: PersonaListItem[]) => {
        this.personas = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar las personas',
          true,
          'error'
        );
      }
    });
  }

  searchShow = false;
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.dataSource.filteredData.length === 0) {
      this.searchShow = true;
      this.searchTerm = filterValue;
    } else {
      this.searchShow = false;
      //this.searchTerm = "No hay grupos que coincidan con tu búsqueda ", filterValue;
    }

  }


  startEdit(persona: PersonaListItem, field: keyof PersonaListItem): void {
    if (field === 'idpersona') return; // No editar ID

    this.editingCell = {
      id: persona.idpersona,
      field: field,
      value: persona[field]?.toString() || ''
    };
    this.tempValue = persona[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updatedPersona = this.personas.find(p => p.idpersona === this.editingCell!.id);
    if (!updatedPersona) return;

    const updateData = {
      ...updatedPersona,
      [this.editingCell.field]: this.tempValue
    };

    this.personaService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.personas.findIndex(p => p.idpersona === this.editingCell!.id);
        if (index !== -1) {
          this.personas[index] = { ...this.personas[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.personas];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Persona actualizada correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar la persona',
          true,
          'error'
        );
        this.cancelEdit();
      }
    });
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.tempValue = '';
  }

  isEditing(persona: PersonaListItem, field: keyof PersonaListItem): boolean {
    return this.editingCell?.id === persona.idpersona && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevaPersona(): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPersonas();
      }
    });
  }

  editarPersona(persona: PersonaListItem): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '600px',
      data: persona,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPersonas();
      }
    });
  }

  eliminarPersona(persona: PersonaListItem): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar la persona ${persona.nombre} ${persona.apellidos}?`
    ).then(confirmado => {
      if (confirmado) {
        this.personaService.delete(persona.idpersona).subscribe({
          next: () => {
            this.cargarPersonas();
            this.notificacionService.mostrarMensaje(
              'Persona eliminada correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar la persona',
              true,
              'error'
            );
          }
        });
      }
    });
  }

  getColumnDisplayName(column: string): string {
    const columnNames: { [key: string]: string } = {
      'solapin': 'Solapín',
      'nombre': 'Nombre',
      'apellidos': 'Apellidos',
      'correo': 'Correo',
      'nombre_cargo': 'Cargo',
      'nombre_estructura': 'Estructura',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
