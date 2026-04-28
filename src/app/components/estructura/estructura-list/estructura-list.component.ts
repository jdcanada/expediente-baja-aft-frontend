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

import { EditableCellEstructura, Estructura, Estructura_Areas_Personas, EstructuraDetalle_Dic_Mov_Inf } from '../../../models/estructura';
import { EstructuraService } from '../../../services/estructura/estructura.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { EstructuraFormComponent } from '../estructura-form/estructura-form.component';



@Component({
  standalone: true,
  selector: 'app-estructura-list',
  templateUrl: './estructura-list.component.html',
  styleUrls: ['./estructura-list.component.css'],
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
export class EstructuraListComponent implements OnInit, AfterViewInit {
  estructuras: Estructura_Areas_Personas[] = [];
  displayedColumns: string[] = [
    'nombre_estructura',
    'codigo_centro_costo',
    'nombre_entidad',
    'acciones'
  ];
  dataSource = new MatTableDataSource<Estructura_Areas_Personas>([]);
  loading = false;
  searchTerm = '';
  editingCell: EditableCellEstructura | null = null;
  tempValue = '';
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private estructuraService: EstructuraService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstructuras();
  }

  ngAfterViewInit(): void {
   
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
      this.cdr.detectChanges();
    
  }

  cargarEstructuras(): void {
    this.loading = true;
    this.estructuraService.listAll().subscribe({
      next: (data: Estructura_Areas_Personas[]) => {
        this.estructuras = data;
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
          'Error al cargar las estructuras',
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


  startEdit(estructura: Estructura, field: keyof Estructura): void {
    if (field === 'idestructura') return;
    this.editingCell = {
      id: estructura.idestructura,
      field: field,
      value: estructura[field]?.toString() || ''
    };
    this.tempValue = estructura[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.estructuras.find(e => e.idestructura === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.estructuraService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.estructuras.findIndex(e => e.idestructura === this.editingCell!.id);
        if (index !== -1) {
          this.estructuras[index] = { ...this.estructuras[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.estructuras];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Estructura actualizada correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar la estructura',
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

  isEditing(estructura: Estructura, field: keyof Estructura): boolean {
    return this.editingCell?.id === estructura.idestructura && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevaEstructura(): void {
    const dialogRef = this.dialog.open(EstructuraFormComponent, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEstructuras();
      }
    });
  }

  editarEstructura(estructura: Estructura): void {
    const dialogRef = this.dialog.open(EstructuraFormComponent, {
      width: '600px',
      data: estructura,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarEstructuras();
      }
    });
  }

  eliminarEstructura(estructura: Estructura): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar la estructura "${estructura.nombre_estructura}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.estructuraService.delete(estructura.idestructura).subscribe({
          next: () => {
            this.cargarEstructuras();
            this.notificacionService.mostrarMensaje(
              'Estructura eliminada correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar la estructura',
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
      'nombre_estructura': 'Nombre de la Estructura',
      'codigo_centro_costo': 'Código Centro Costo',
      'nombre_entidad': 'Entidad',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
