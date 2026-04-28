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
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { Comision, EditableCellComision } from '../../../models/comision';
import { ComisionService } from '../../../services/comision/comision.service';
import { ComisionForm } from '../comision-form/comision-form.component';

@Component({
  selector: 'app-comision-list.component',
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
  ],
  templateUrl: './comision-list.component.html',
  styleUrl: './comision-list.component.css'
})
export class ComisionList implements OnInit, AfterViewInit {
  comisiones: Comision[] = [];
  displayedColumns: string[] = ['nombre_comision', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Comision>([]);
  loading = false;
  searchTerm = '';
  editingCell: EditableCellComision | null = null;
  tempValue = '';
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private comisionService: ComisionService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarComisiones();
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();

  }

  cargarComisiones(): void {
    this.loading = true;
    this.comisionService.listAll().subscribe({
      next: (data: Comision[]) => {
        this.comisiones = data;
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
          'Error al cargar las comisiones',
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


  startEdit(comision: Comision, field: keyof Comision): void {
    if (field === 'idcomision') return;
    this.editingCell = {
      id: comision.idcomision,
      field: field,
      value: comision[field]?.toString() || ''
    };
    this.tempValue = comision[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updatedComision = this.comisiones.find(c => c.idcomision === this.editingCell!.id);
    if (!updatedComision) return;

    const updateData = {
      ...updatedComision,
      [this.editingCell.field]: this.tempValue
    };

    this.comisionService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.comisiones.findIndex(c => c.idcomision === this.editingCell!.id);
        if (index !== -1) {
          this.comisiones[index] = { ...this.comisiones[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.comisiones];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Comisión actualizada correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar la comisión',
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

  isEditing(comision: Comision, field: keyof Comision): boolean {
    return this.editingCell?.id === comision.idcomision && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevaComision(): void {
    const dialogRef = this.dialog.open(ComisionForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarComisiones();
      }
    });
  }

  editarComision(comision: Comision): void {
    const dialogRef = this.dialog.open(ComisionForm, {
      width: '600px',
      data: comision,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarComisiones();
      }
    });
  }

  eliminarComision(comision: Comision): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar la comisión "${comision.nombre_comision}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.comisionService.delete(comision.idcomision).subscribe({
          next: () => {
            this.cargarComisiones();
            this.notificacionService.mostrarMensaje(
              'Comisión eliminada correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar la comisión',
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
      'nombre_comision': 'Nombre de la Comisión',
      'descripcion': 'Descripción',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
