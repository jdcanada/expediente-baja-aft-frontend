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

import { EditableCellExpediente, Expediente, ExpedienteDetalle_4 } from '../../../models/expediente';
import { ExpedienteService } from '../../../services/expediente/expediente.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { ExpedienteFormComponent } from '../expediente-form/expediente-form.component';



@Component({
  standalone: true,
  selector: 'app-expediente-list',
  templateUrl: './expediente-list.component.html',
  styleUrls: ['./expediente-list.component.css'],
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
export class ExpedienteList implements OnInit, AfterViewInit {
  expedientes: ExpedienteDetalle_4[] = [];
  displayedColumns: string[] = ['no_expediente', 'fecha_creacion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<ExpedienteDetalle_4>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellExpediente | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private expedienteService: ExpedienteService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarExpedientes();
  }

  ngAfterViewInit(): void {
   
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
      this.cdr.detectChanges();
    
  }

  cargarExpedientes(): void {
    this.loading = true;
    this.expedienteService.listAll().subscribe({
      next: (data: ExpedienteDetalle_4[]) => {
        this.expedientes = data;
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.pageSize = this.pageSize;
          this.cdr.detectChanges();
        }
        this.loading = false;
        //this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar los expedientes',
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


  startEdit(expediente: Expediente, field: keyof Expediente): void {
    if (field === 'idexpediente' || field === 'estructura_id') return; // No editar ID ni FK

    this.editingCell = {
      id: expediente.idexpediente!,
      field: field,
      value: expediente[field]?.toString() || ''
    };
    this.tempValue = expediente[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.expedientes.find(e => e.idexpediente === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.expedienteService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.expedientes.findIndex(e => e.idexpediente === this.editingCell!.id);
        if (index !== -1) {
          this.expedientes[index] = { ...this.expedientes[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.expedientes];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Expediente actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el expediente',
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

  isEditing(expediente: Expediente, field: keyof Expediente): boolean {
    return this.editingCell?.id === expediente.idexpediente && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoExpediente(): void {
    const dialogRef = this.dialog.open(ExpedienteFormComponent, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarExpedientes();
      }
    });
  }

  editarExpediente(expediente: Expediente): void {
    const dialogRef = this.dialog.open(ExpedienteFormComponent, {
      width: '600px',
      data: expediente,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarExpedientes();
      }
    });
  }

  eliminarExpediente(expediente: Expediente): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el expediente "${expediente.no_expediente}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.expedienteService.delete(expediente.idexpediente!).subscribe({
          next: () => {
            this.cargarExpedientes();
            this.notificacionService.mostrarMensaje(
              'Expediente eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el expediente',
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
      'no_expediente': 'No. Expediente',
      'fecha_creacion': 'Fecha de Creación',
      'estado': 'Estado',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
