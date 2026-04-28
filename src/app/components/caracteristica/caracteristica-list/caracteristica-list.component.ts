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
import { RouterModule } from '@angular/router';

import { Caracteristica } from '../../../models/caracteristica';
import { CaracteristicaService } from '../../../services/caracteristica/caracteristica.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { CaracteristicaFormComponent } from '../caracteristica-form/caracteristica-form.component';

interface EditableCell {
  id: number;
  field: keyof Caracteristica;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-caracteristica-list',
  templateUrl: './caracteristica-list.component.html',
  styleUrls: ['./caracteristica-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class CaracteristicaListComponent implements OnInit, AfterViewInit {
  caracteristicas: Caracteristica[] = [];
  displayedColumns: string[] = ['descripcion_c', 'acciones'];
  dataSource = new MatTableDataSource<Caracteristica>([]);
  loading = false;
  searchTerm = '';
  searchShow = false;
  pageSize = 5;

  editingCell: EditableCell | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private caracteristicaService: CaracteristicaService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCaracteristicas();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
      this.cdr.detectChanges();
    }
  }

  cargarCaracteristicas(): void {
    this.loading = true;
    this.caracteristicaService.listAll().subscribe({
      next: (data: Caracteristica[]) => {
        this.caracteristicas = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar las características',
          true,
          'error'
        );
      }
    });
  }

  
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

  startEdit(caracteristica: Caracteristica, field: keyof Caracteristica): void {
    if (field === 'idcaracteristica') return; // No editar ID

    this.editingCell = {
      id: caracteristica.idcaracteristica,
      field: field,
      value: caracteristica[field]?.toString() || ''
    };
    this.tempValue = caracteristica[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.caracteristicas.find(c => c.idcaracteristica === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.caracteristicaService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.caracteristicas.findIndex(c => c.idcaracteristica === this.editingCell!.id);
        if (index !== -1) {
          this.caracteristicas[index] = { ...this.caracteristicas[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.caracteristicas];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Característica actualizada correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar la característica',
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

  isEditing(caracteristica: Caracteristica, field: keyof Caracteristica): boolean {
    return this.editingCell?.id === caracteristica.idcaracteristica && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevaCaracteristica(): void {
    const dialogRef = this.dialog.open(CaracteristicaFormComponent, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCaracteristicas();
      }
    });
  }

  editarCaracteristica(caracteristica: Caracteristica): void {
    const dialogRef = this.dialog.open(CaracteristicaFormComponent, {
      width: '600px',
      data: caracteristica,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCaracteristicas();
      }
    });
  }

  eliminarCaracteristica(caracteristica: Caracteristica): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar la característica "${caracteristica.descripcion_c}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.caracteristicaService.delete(caracteristica.idcaracteristica).subscribe({
          next: () => {
            this.cargarCaracteristicas();
            this.notificacionService.mostrarMensaje(
              'Característica eliminada correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar la característica',
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
      'idcaracteristica': 'ID',
      'descripcion_c': 'Descripción',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
