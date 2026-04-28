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
import { RouterModule } from '@angular/router';

import { EditableCellTipoMovimiento, TipoMovimiento } from '../../../models/tipoMovimiento';
import { TipoMovimientoService } from '../../../services/tipomovimiento/tipomovimiento.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { TipomovimientoForm } from '../tipomovimiento-form/tipomovimiento-form.component';


@Component({
  standalone: true,
  selector: 'app-tipomovimiento-list',
  templateUrl: './tipomovimiento-list.component.html',
  styleUrls: ['./tipomovimiento-list.component.css'],
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
export class TipoMovimientoList implements OnInit, AfterViewInit {
  movimientos: TipoMovimiento[] = [];
  displayedColumns: string[] = ['nombre_movimiento', 'acciones'];
  dataSource = new MatTableDataSource<TipoMovimiento>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellTipoMovimiento | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private tipoMovimientoService: TipoMovimientoService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarMovimientos(): void {
    this.loading = true;
    this.tipoMovimientoService.listAll().subscribe({
      next: (data: TipoMovimiento[]) => {
        this.movimientos = data;
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar los tipos de movimiento',
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


  startEdit(mov: TipoMovimiento, field: keyof TipoMovimiento): void {
    if (field === 'idtipo') return; // No editar ID

    this.editingCell = {
      id: mov.idtipo,
      field: field,
      value: mov[field]?.toString() || ''
    };
    this.tempValue = mov[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.movimientos.find(m => m.idtipo === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.tipoMovimientoService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.movimientos.findIndex(m => m.idtipo === this.editingCell!.id);
        if (index !== -1) {
          this.movimientos[index] = { ...this.movimientos[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.movimientos];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Tipo de movimiento actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el tipo de movimiento',
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

  isEditing(mov: TipoMovimiento, field: keyof TipoMovimiento): boolean {
    return this.editingCell?.id === mov.idtipo && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoMovimiento(): void {
    const dialogRef = this.dialog.open(TipomovimientoForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarMovimientos();
      }
    });
  }

  editarMovimiento(mov: TipoMovimiento): void {
    const dialogRef = this.dialog.open(TipomovimientoForm, {
      width: '600px',
      data: mov,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarMovimientos();
      }
    });
  }

  eliminarMovimiento(mov: TipoMovimiento): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el tipo de movimiento "${mov.descripcion}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.tipoMovimientoService.delete(mov.idtipo).subscribe({
          next: () => {
            this.cargarMovimientos();
            this.notificacionService.mostrarMensaje(
              'Tipo de movimiento eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el tipo de movimiento',
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
     
      'nombre_movimiento': 'Tipo de Movimiento',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
