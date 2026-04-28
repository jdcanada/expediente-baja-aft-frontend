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

import { EditableCellInformeResumen, InformeResumen, InformeResumenCompleto } from '../../../models/informeResumen';
import { InformeresumenService } from '../../../services/informeresumen/informeresumen.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { InformeresumenForm } from '../informeresumen-form/informeresumen-form.component';



@Component({
  standalone: true,
  selector: 'app-informeresumen-list',
  templateUrl: './informeresumen-list.component.html',
  styleUrls: ['./informeresumen-list.component.css'],
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
export class InformeresumenList implements OnInit, AfterViewInit {
  informes: InformeResumenCompleto[] = [];
  displayedColumns: string[] = ['expediente_id', 'fecha_informe', 'observaciones', 'autorizado_por_id', 'aprobado_por_id', 'jefe_comision_id', 'acciones'];
  dataSource = new MatTableDataSource<InformeResumenCompleto>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellInformeResumen | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private informeService: InformeresumenService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarInformes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarInformes(): void {
    this.loading = true;
    this.informeService.listAll().subscribe({
      next: (data: InformeResumenCompleto[]) => {
        this.informes = data;
        this.dataSource.data = data;
        console.log(data)
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar los informes',
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


  startEdit(informe: InformeResumen, field: keyof InformeResumen): void {
    if (field === 'idinforme' || field === 'expediente_id' || field === 'fecha_informe' || field.endsWith('_id')) return;
    this.editingCell = {
      id: informe.idinforme!,
      field: field,
      value: informe[field]?.toString() || ''
    };
    this.tempValue = informe[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.informes.find(i => i.idinforme === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.informeService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.informes.findIndex(i => i.idinforme === this.editingCell!.id);
        if (index !== -1) {
          this.informes[index] = { ...this.informes[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.informes];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Informe actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el informe',
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

  isEditing(informe: InformeResumen, field: keyof InformeResumen): boolean {
    return this.editingCell?.id === informe.idinforme && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoInforme(): void {
    const dialogRef = this.dialog.open(InformeresumenForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarInformes();
      }
    });
  }

  editarInforme(informe: InformeResumen): void {
    const dialogRef = this.dialog.open(InformeresumenForm, {
      width: '600px',
      data: informe,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarInformes();
      }
    });
  }

  eliminarInforme(informe: InformeResumen): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el informe del expediente #${informe.expediente_id}?`
    ).then(confirmado => {
      if (confirmado) {
        this.informeService.delete(informe.idinforme!).subscribe({
          next: () => {
            this.cargarInformes();
            this.notificacionService.mostrarMensaje(
              'Informe eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el informe',
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
      'expediente_id': 'Expediente',
      'fecha_informe': 'Fecha',
      'observaciones': 'Observaciones',
      'autorizado_por_id': 'Autorizado por',
      'aprobado_por_id': 'Aprobado por',
      'jefe_comision_id': 'Responsable de comisión',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
