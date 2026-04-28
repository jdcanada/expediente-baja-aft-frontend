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

import { EditableCellMovimientoAft, MovimientoAFT, MovimientoAFTCompleto} from '../../../models/movimientoaft';
import { MovimientoaftService } from '../../../services/movimientoaft/movimientoaft.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { MovimientoaftForm } from '../movimientoaft-form/movimientoaft-form.component';



@Component({
  standalone: true,
  selector: 'app-movimientoaft-list',
  templateUrl: './movimientoaft-list.component.html',
  styleUrls: ['./movimientoaft-list.component.css'],
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
export class MovimientoAFTList implements OnInit, AfterViewInit {
  movimientos: MovimientoAFTCompleto[] = [];
  displayedColumns: string[] = [
    'expediente_id',
    'tipo_movimiento_id',
    'hecho_por_id',
    'autorizado_por_id',
    'aprobado_por_id',
    'fecha_movimiento',
    'fundamentacion_operacion',
    'acciones'
  ];
  dataSource = new MatTableDataSource<MovimientoAFTCompleto>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellMovimientoAft | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private movimientoService: MovimientoaftService,
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
    this.movimientoService.listAll().subscribe({
      next: (data: MovimientoAFTCompleto[]) => {
        this.movimientos = data;
        this.dataSource.data = data;
        console.log(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar los movimientos',
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


  startEdit(mov: MovimientoAFTCompleto, field: keyof MovimientoAFTCompleto): void {
    if (field !== 'fundamentacion_operacion') return;
    this.editingCell = {
      id: mov.idmovimiento,
      field: field,
      value: mov[field]?.toString() || ''
    };
    this.tempValue = mov[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.movimientos.find(m => m.idmovimiento === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.movimientoService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.movimientos.findIndex(m => m.idmovimiento === this.editingCell!.id);
        if (index !== -1) {
          this.movimientos[index] = { ...this.movimientos[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.movimientos];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Movimiento actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el movimiento',
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

  isEditing(mov: MovimientoAFTCompleto, field: keyof MovimientoAFTCompleto): boolean {
    return this.editingCell?.id === mov.idmovimiento && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoMovimiento(): void {
    const dialogRef = this.dialog.open(MovimientoaftForm, {
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

  editarMovimiento(mov: MovimientoAFTCompleto): void {
    const dialogRef = this.dialog.open(MovimientoaftForm, {
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

  eliminarMovimiento(mov: MovimientoAFTCompleto): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el movimiento del expediente #${mov.expediente?.no_expediente}?`
    ).then(confirmado => {
      if (confirmado) {
        this.movimientoService.delete(mov.idmovimiento).subscribe({
          next: () => {
            this.cargarMovimientos();
            this.notificacionService.mostrarMensaje(
              'Movimiento eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el movimiento',
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
      'idmovimiento': 'ID',
      'expediente_id': 'Expediente',
      'entidad_id': 'Entidad',
      'tipo_movimiento_id': 'Tipo de Movimiento',
      'hecho_por_id': 'Hecho por',
      'autorizado_por_id': 'Autorizado por',
      'aprobado_por_id': 'Aprobado por',
      'fecha_movimiento': 'Fecha',
      'fundamentacion_operacion': 'Fundamentación de la Operación',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
