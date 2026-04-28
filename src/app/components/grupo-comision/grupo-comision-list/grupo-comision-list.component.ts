import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GrupoComisionService } from '../../../services/grupo-comision/grupo-comision.service';
import { GrupoComision, EditableCellGrupoComision, GrupoComisionDetalle } from '../../../models/grupoComision';
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
import { GrupoComisionForm } from '../grupo-comision-form/grupo-comision-form.component';

@Component({
  selector: 'app-grupo-comision-list',
  templateUrl: './grupo-comision-list.component.html',
  styleUrl: './grupo-comision-list.component.css',
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
export class GrupoComisionList implements OnInit, AfterViewInit {
  grupos: GrupoComisionDetalle[] = [];
  displayedColumns: string[] = [
    'nombre_comision',
    'nombre_grupo',
    'descripcion',
    'acciones'
  ];
  dataSource = new MatTableDataSource<GrupoComisionDetalle>([]);
  loading = false;
  searchTerm = '';
  searchShow = false;
  pageSize = 5;

  editingCell: EditableCellGrupoComision | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private grupoComisionService: GrupoComisionService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarGrupos(): void {
    this.loading = true;
    this.grupoComisionService.listAll().subscribe({
      next: (data: GrupoComisionDetalle[]) => {
        this.grupos = data;
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
          'Error al cargar los grupos de comisión',
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

  startEdit(grupo: GrupoComisionDetalle, field: keyof GrupoComisionDetalle): void {
    if (field !== 'nombre_grupo' && field !== 'descripcion') return;
    this.editingCell = {
      id: grupo.idgrupo,
      field: field,
      value: grupo[field]?.toString() || ''
    };
    this.tempValue = grupo[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    const updated = this.grupos.find(g => g.idgrupo === this.editingCell!.id);
    if (!updated) return;
    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.grupoComisionService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.grupos.findIndex(g => g.idgrupo === this.editingCell!.id);
        if (index !== -1) {
          this.grupos[index] = { ...this.grupos[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.grupos];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Grupo de comisión actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el grupo de comisión',
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

  isEditing(grupo: GrupoComisionDetalle, field: keyof GrupoComisionDetalle): boolean {
    return this.editingCell?.id === grupo.idgrupo && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  eliminarGrupo(grupo: GrupoComisionDetalle): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el grupo "${grupo.nombre_grupo}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.grupoComisionService.delete(grupo.idgrupo).subscribe({
          next: () => {
            this.cargarGrupos();
            this.notificacionService.mostrarMensaje(
              'Grupo de comisión eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el grupo de comisión',
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
      'nombre_comision': 'Comisión a que pertenece',
      'nombre_grupo': 'Nombre del Grupo',
      'descripcion': 'Descripción',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }

  abrirFormularioNuevoGrupo(): void {
    const dialogRef = this.dialog.open(GrupoComisionForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarGrupos();
      }
    });
  }

  editarGrupo(grupo: GrupoComision): void {
    const dialogRef = this.dialog.open(GrupoComisionForm, {
      width: '600px',
      data: grupo,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarGrupos();
      }
    });
  }
}
