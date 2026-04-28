import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DirectivoService } from '../../../services/directivo/directivo.service';
import { Directivo, DirectivoDetalle, EditableCellDirectivo } from '../../../models/directivo';
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
import { DirectivoForm } from '../directivo-form/directivo-form.component';

@Component({
  selector: 'app-directivo-list',
  templateUrl: './directivo-list.component.html',
  styleUrl: './directivo-list.component.css',
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
export class DirectivoList implements OnInit, AfterViewInit {
  directivos: DirectivoDetalle[] = [];
  displayedColumns: string[] = [
    'nombre',
    'apellidos',
    'solapin',
    'correo',
    'cargo',
    'telefono_corporativo',
    'acciones'
  ];
  dataSource = new MatTableDataSource<DirectivoDetalle>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellDirectivo | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private directivoService: DirectivoService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDirectivos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarDirectivos(): void {
    this.loading = true;
    this.directivoService.listAll().subscribe({
      next: (data: DirectivoDetalle[]) => {
        this.directivos = data;
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
          'Error al cargar los directivos',
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


  // Solo permite edición inline de telefono_corporativo
  startEdit(directivo: Directivo, field: keyof Directivo): void {
    if (field !== 'telefono_corporativo') return;
    this.editingCell = {
      id: directivo.iddirectivo,
      field: field,
      value: directivo[field]?.toString() || ''
    };
    this.tempValue = directivo[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    const updated = this.directivos.find(d => d.iddirectivo === this.editingCell!.id);
    if (!updated) return;
    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.directivoService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.directivos.findIndex(d => d.iddirectivo === this.editingCell!.id);
        if (index !== -1) {
          this.directivos[index] = { ...this.directivos[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.directivos];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Directivo actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el directivo',
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

  isEditing(directivo: Directivo, field: keyof Directivo): boolean {
    return this.editingCell?.id === directivo.iddirectivo && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  eliminarDirectivo(directivo: DirectivoDetalle): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el directivo "${directivo.persona.nombre} ${directivo.persona.apellidos}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.directivoService.delete(directivo.iddirectivo).subscribe({
          next: () => {
            this.cargarDirectivos();
            this.notificacionService.mostrarMensaje(
              'Directivo eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el directivo',
              true,
              'error'
            );
          }
        });
      }
    });
  }

  editarDirectivo(directivo: Directivo): void {
  const dialogRef = this.dialog.open(DirectivoForm, {
    width: '600px',
    data: directivo,
    panelClass: 'custom-dialog-container'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.cargarDirectivos();
    }
  });
}


  getColumnDisplayName(column: string): string {
    const columnNames: { [key: string]: string } = {
      'nombre': 'Nombre',
      'apellidos': 'Apellidos',
      'solapin': 'Solapín',
      'correo': 'Correo',
      'cargo': 'Cargo',
      'telefono_corporativo': 'Teléfono Corporativo',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }

  abrirFormularioNuevoDirectivo(): void {
    const dialogRef = this.dialog.open(DirectivoForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDirectivos();
      }
    });
  }
}
