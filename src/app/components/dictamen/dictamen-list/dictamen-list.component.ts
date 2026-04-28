import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DictamenService } from '../../../services/dictamen/dictamen.service';
import { Dictamen, DictamenDetalle, DictamenListado, EditableCellDictamen } from '../../../models/dictamen';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DictamenForm } from '../dictamen-form/dictamen-form.component';
import { DictamenDetallesDialogComponent } from '../dictamen-detalles-dialog-component/dictamen-detalles-dialogcomponent';

@Component({
  selector: 'app-dictamen-list',
  templateUrl: './dictamen-list.component.html',
  styleUrl: './dictamen-list.component.css',
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
export class DictamenList implements OnInit, AfterViewInit {
  dictamenes: DictamenListado[] = [];
  displayedColumns: string[] = ['no_dictamen', 'expediente', 'no_inventario', 'fecha_dictamen', 'acciones'];

  dataSource = new MatTableDataSource<DictamenListado>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellDictamen | null = null;
  tempValue = '';
  searchShow = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dictamenService: DictamenService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDictamenes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarDictamenes(): void {
    this.loading = true;
    this.dictamenService.listAll().subscribe({
      next: (data: DictamenListado[]) => {
        this.dictamenes = data;
        this.dataSource.data = data;
        console.log(data)
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
          'Error al cargar los dictámenes',
          true,
          'error'
        );
      }
    });
  }

  verDetallesDictamen(dictamen: DictamenListado): void {
  this.dialog.open(DictamenDetallesDialogComponent, {
    width: '700px',
    data: dictamen,
    panelClass: 'custom-dialog-container'
  });
}

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.searchShow = this.dataSource.filteredData.length === 0;
  }

  startEdit(dictamen: DictamenListado, field: keyof DictamenListado): void {
    if (field !== 'argumentacion_tecnica' && field !== 'destino_final') return;
    this.editingCell = {
      id: dictamen.iddictamen,
      field: field,
      value: dictamen[field]?.toString() || ''
    };
    this.tempValue = dictamen[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    const updated = this.dictamenes.find(d => d.iddictamen === this.editingCell!.id);
    if (!updated) return;
    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.dictamenService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.dictamenes.findIndex(d => d.iddictamen === this.editingCell!.id);
        if (index !== -1) {
          this.dictamenes[index] = { ...this.dictamenes[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.dictamenes];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Dictamen actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el dictamen',
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

  isEditing(dictamen: DictamenListado, field: keyof DictamenListado): boolean {
    return this.editingCell?.id === dictamen.iddictamen && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  eliminarDictamen(dictamen: Dictamen): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el dictamen número "${dictamen.no_dictamen}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.dictamenService.delete(dictamen.iddictamen!).subscribe({
          next: () => {
            this.cargarDictamenes();
            this.notificacionService.mostrarMensaje(
              'Dictamen eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el dictamen',
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
      'no_dictamen': 'N° Dictamen',
      'expediente': 'Expediente',
      'mediobasico': 'Medio Básico',
      'comision': 'Comisión',
      'solicita': 'Solicita',
      'argumentacion_tecnica': 'Argumentación Técnica',
      'destino_final': 'Destino Final',
      'conclusion_reparable': '¿Reparable?',
      'fecha_dictamen': 'Fecha',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }

  abrirFormularioNuevoDictamen(): void {
    const dialogRef = this.dialog.open(DictamenForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDictamenes();
      }
    });
  }

  editarDictamen(dictamen: Dictamen): void {
    const dialogRef = this.dialog.open(DictamenForm, {
      width: '600px',
      data: dictamen,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDictamenes();
      }
    });
  }
}
