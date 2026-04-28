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
import { AreaForm } from '../area-form/area-form.component';
import { AreaDetalleSimple, AreaDetalleSimple_bolt, EditableCellArea } from '../../../models/area';
import { AreaService } from '../../../services/area/area.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';



@Component({
  standalone: true,
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.css'],
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
export class AreaList implements OnInit, AfterViewInit {
  areas: AreaDetalleSimple[] = [];
  displayedColumns: string[] = [
    'codigo_area',
    'nombre_area',
    'nombre_estructura',
    'codigo_centro_costo',
    'nombre_entidad',
    'acciones'
  ];
  dataSource = new MatTableDataSource<AreaDetalleSimple>([]);
  loading = false;
  searchTerm = '';

  // Inline editing properties
  editingCell: EditableCellArea | null = null;
  tempValue = '';
  pageSize = 5; // O el valor que prefieras

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private areaService: AreaService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef  // <-- Agregar aquí
  ) { }

  ngOnInit(): void {
    this.cargarAreas();
  }

  ngAfterViewInit(): void {
    
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
      this.cdr.detectChanges();
    
  }

  cargarAreas(): void {
    this.loading = true;
    this.areaService.listAll().subscribe({
      next: (data: AreaDetalleSimple[]) => {
        this.areas = data;
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
          'Error al cargar las áreas',
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
  startEdit(area: AreaDetalleSimple_bolt, field: keyof AreaDetalleSimple_bolt): void {
    if (field === 'idarea') return; // Don't allow editing ID

    this.editingCell = {
      id: area.idarea,
      field: field,
      value: area[field]?.toString() || ''
    };
    this.tempValue = area[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updatedArea = this.areas.find(a => a.idarea === this.editingCell!.id);
    if (!updatedArea) return;

    // Create update object
    const updateData = {
      ...updatedArea,
      [this.editingCell.field]: this.tempValue
    };

    this.areaService.update(this.editingCell.id, updateData).subscribe({
      next: (result) => {
        // Update local data
        const index = this.areas.findIndex(a => a.idarea === this.editingCell!.id);
        if (index !== -1) {
          this.areas[index] = { ...this.areas[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.areas];
        }

        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Área actualizada correctamente',
          true,
          'success'
        );
      },
      error: (error) => {
        console.error('Error updating area:', error);
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el área',
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

  isEditing(area: AreaDetalleSimple_bolt, field: keyof AreaDetalleSimple_bolt): boolean {
    return this.editingCell?.id === area.idarea && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevaArea(): void {
    const dialogRef = this.dialog.open(AreaForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarAreas();
      }
    });
  }

  editarArea(area: AreaDetalleSimple): void {
    const dialogRef = this.dialog.open(AreaForm, {
      width: '600px',
      data: area,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarAreas();
      }
    });
  }

  eliminarArea(area: AreaDetalleSimple): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el área ${area.nombre_area}?`
    ).then(confirmado => {
      if (confirmado) {
        this.areaService.delete(area.idarea).subscribe({
          next: () => {
            this.cargarAreas();
            this.notificacionService.mostrarMensaje(
              'Área eliminada correctamente',
              true,
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting area:', error);
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el área',
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
      'codigo_area': 'Código',
      'nombre_area': 'Nombre del Área',
      'nombre_estructura': 'Estructura',
      'codigo_centro_costo': 'Centro Costo',
      'nombre_entidad': 'Entidad',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}