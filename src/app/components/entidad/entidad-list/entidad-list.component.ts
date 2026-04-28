import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditableCellEntidad, Entidad, EntidadDetalleCompleto } from '../../../models/entidad'; // Ajusta ruta
import { EntidadService } from '../../../services/entidad/entidad.service'; // Ajusta ruta
import { NotificacionService } from '../../../services/notificacion/notificacion.service'; // Ajusta ruta
import { EntidadForm } from '../entidad-form/entidad-form.component'; // Ajusta ruta



@Component({
  standalone: true,
  selector: 'app-entidad-list',
  templateUrl: './entidad-list.component.html',
  styleUrls: ['./entidad-list.component.css'],
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
export class EntidadList implements OnInit, AfterViewInit {
  entidades: EntidadDetalleCompleto[] = [];
  displayedColumns: string[] = ['nombre_entidad', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<EntidadDetalleCompleto>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellEntidad | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private entidadService: EntidadService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarEntidades();
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();

  }

  cargarEntidades(): void {
    this.loading = true;
    this.entidadService.listAll().subscribe({
      next: (data: EntidadDetalleCompleto[]) => {
        this.entidades = data;
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.pageSize = this.pageSize;
          this.cdr.detectChanges();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar las entidades',
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


  startEdit(entidad: Entidad, field: keyof Entidad): void {
    if (field === 'identidad') return; // No editar ID

    this.editingCell = {
      id: entidad.identidad,
      field: field,
      value: entidad[field]?.toString() || ''
    };
    this.tempValue = entidad[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updatedEntidad = this.entidades.find(e => e.identidad === this.editingCell!.id);
    if (!updatedEntidad) return;

    const updateData = {
      ...updatedEntidad,
      [this.editingCell.field]: this.tempValue
    };

    this.entidadService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.entidades.findIndex(e => e.identidad === this.editingCell!.id);
        if (index !== -1) {
          this.entidades[index] = { ...this.entidades[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.entidades];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Entidad actualizada correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar la entidad',
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

  isEditing(entidad: Entidad, field: keyof Entidad): boolean {
    return this.editingCell?.id === entidad.identidad && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevaEntidad(): void {
    const dialogRef = this.dialog.open(EntidadForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEntidades();
      }
    });
  }

  editarEntidad(entidad: Entidad): void {
    const dialogRef = this.dialog.open(EntidadForm, {
      width: '600px',
      data: entidad,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEntidades();
      }
    });
  }

  eliminarEntidad(entidad: Entidad): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar la entidad "${entidad.nombre_entidad}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.entidadService.delete(entidad.identidad).subscribe({
          next: () => {
            this.cargarEntidades();
            this.notificacionService.mostrarMensaje(
              'Entidad eliminada correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar la entidad',
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

      'nombre_entidad': 'Nombre',
      'descripcion': 'Descripción',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
