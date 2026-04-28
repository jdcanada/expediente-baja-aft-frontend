import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ClasificacionService } from '../../../services/clasificacion/clasificacion.service';
import { Clasificacion, EditableCellClasificacion } from '../../../models/clasificacion';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ClasificacionFormComponent } from '../clasificacion-form/clasificacion-form.component';

@Component({
  selector: 'app-clasificacion-list.component',
  templateUrl: './clasificacion-list.component.html',
  styleUrl: './clasificacion-list.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule


  ]
})
export class ClasificacionListComponent implements OnInit, AfterViewInit {
  clasificaciones: Clasificacion[] = [];
  displayedColumns: string[] = ['descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Clasificacion>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;  // Valor inicial deseado

  editingCell: EditableCellClasificacion | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clasificacionService: ClasificacionService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.cargarClasificaciones();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarClasificaciones(): void {
    this.loading = true;
    this.clasificacionService.listAll().subscribe({
      next: (data: Clasificacion[]) => {
        this.clasificaciones = data;
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.pageSize = this.pageSize;
          this.cdr.detectChanges();
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar las clasificaciones',
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


  // Inline editing methods
  startEdit(clasificacion: Clasificacion, field: keyof Clasificacion): void {
    if (field === 'idclasificacion') return; // Don't allow editing ID

    this.editingCell = {
      id: clasificacion.idclasificacion,
      field: field,
      value: clasificacion[field]?.toString() || ''
    };
    this.tempValue = clasificacion[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updatedClasificacion = this.clasificaciones.find(c => c.idclasificacion === this.editingCell!.id);
    if (!updatedClasificacion) return;
    const updateData = {
      ...updatedClasificacion,
      [this.editingCell.field]: this.tempValue
    };

    this.clasificacionService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.clasificaciones.findIndex(c => c.idclasificacion === this.editingCell!.id);
        if (index !== -1) {
          this.clasificaciones[index] = { ...this.clasificaciones[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.clasificaciones];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Clasificación actualizada correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar la clasificación',
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

  isEditing(clasificacion: Clasificacion, field: keyof Clasificacion): boolean {
    return this.editingCell?.id === clasificacion.idclasificacion && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  eliminarClasificacion(clasificacion: Clasificacion): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar la clasificación "${clasificacion.descripcion}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.clasificacionService.delete(clasificacion.idclasificacion).subscribe({
          next: () => {
            this.cargarClasificaciones();
            this.notificacionService.mostrarMensaje(
              'Clasificación eliminada correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar la clasificación',
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
      'idclasificacion': 'ID',
      'descripcion': 'Descripción',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }

  abrirFormularioNuevaClasificacion(): void {
    const dialogRef = this.dialog.open(ClasificacionFormComponent, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarClasificaciones();
      }
    });
  }

}