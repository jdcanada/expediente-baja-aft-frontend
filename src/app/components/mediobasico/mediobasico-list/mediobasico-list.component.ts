import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Mediobasico, EditableCellMedioBasico, MediobasicoListItem } from '../../../models/medioBasico';
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
import { MediobasicoForm } from '../mediobasico-form/mediobasico-form.component';
import { MediobasicoService } from '../../../services/mediobasico/mediobasico.service';

@Component({
  selector: 'app-mediobasico-list',
  templateUrl: './mediobasico-list.component.html',
  styleUrl: './mediobasico-list.component.css',
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
export class MedioBasicoList implements OnInit, AfterViewInit {
  mediobasicos: MediobasicoListItem[] = [];
  displayedColumns: string[] = ['no_inventario','aft','clasificacion','caracteristica','area','acciones'];
  dataSource = new MatTableDataSource<MediobasicoListItem>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellMedioBasico | null = null;
  tempValue = '';
  searchShow = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private medioBasicoService: MediobasicoService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMediosBasicos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarMediosBasicos(): void {
    this.loading = true;
    this.medioBasicoService.listAll().subscribe({
      next: (data: MediobasicoListItem[]) => {
        this.mediobasicos = data;
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
          'Error al cargar los medios básicos',
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
    this.searchShow = this.dataSource.filteredData.length === 0;
  }

  startEdit(mb: MediobasicoListItem, field: keyof MediobasicoListItem): void {
    if (field !== 'no_inventario' && field !== 'aft') return;
    this.editingCell = {
      id: mb.idmediobasico,
      field: field,
      value: mb[field]?.toString() || ''
    };
    this.tempValue = mb[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    const updated = this.mediobasicos.find(mb => mb.idmediobasico === this.editingCell!.id);
    if (!updated) return;
    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.medioBasicoService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.mediobasicos.findIndex(mb => mb.idmediobasico === this.editingCell!.id);
        if (index !== -1) {
          this.mediobasicos[index] = { ...this.mediobasicos[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.mediobasicos];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Medio Básico actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el medio básico',
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

  isEditing(mb: MediobasicoListItem, field: keyof MediobasicoListItem): boolean {
    return this.editingCell?.id === mb.idmediobasico && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  eliminarMedioBasico(mb: MediobasicoListItem): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el medio básico "${mb.no_inventario} - ${mb.aft}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.medioBasicoService.delete(mb.idmediobasico).subscribe({
          next: () => {
            this.cargarMediosBasicos();
            this.notificacionService.mostrarMensaje(
              'Medio básico eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el medio básico',
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
      'no_inventario': 'No. Inventario',
      'aft': 'AFT',
      'clasificacion': 'Clasificación',
      'caracteristica': 'Característica',
      'area': 'Área',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }

  abrirFormularioNuevoMedioBasico(): void {
    const dialogRef = this.dialog.open(MediobasicoForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarMediosBasicos();
      }
    });
  }

  editarMedioBasico(mb: MediobasicoListItem): void {
    const dialogRef = this.dialog.open(MediobasicoForm, {
      width: '600px',
      data: mb,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarMediosBasicos();
      }
    });
  }
}
