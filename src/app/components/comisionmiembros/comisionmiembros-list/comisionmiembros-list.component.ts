import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { ComisionMiembroDetalle, EditableCellComisionMiembro } from '../../../models/comisionMiembro';
import { ComisionmiembrosService } from '../../../services/comisionmiembros/comisionmiembros.service';
import { ComisionmiembrosForm } from '../comisionmiembros-form/comisionmiembros-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-comisionmiembro-list',
  templateUrl: './comisionmiembros-list.component.html',
  styleUrls: ['./comisionmiembros-list.component.css'],
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
export class ComisionMiembrosList implements OnInit, AfterViewInit {
  miembros: ComisionMiembroDetalle[] = [];
  displayedColumns: string[] = [
    'comision',
    'grupo',
    'nombre',
    'es_responsable',
    'acciones'
  ];
  dataSource = new MatTableDataSource<ComisionMiembroDetalle>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;
  searchShow = false;

  editingCell: EditableCellComisionMiembro | null = null;
  tempValue: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private miembroService: ComisionmiembrosService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMiembros();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
  }

  cargarMiembros(): void {
    this.loading = true;
    this.miembroService.listAll().subscribe({
      next: (data: ComisionMiembroDetalle[]) => {
        this.miembros = data;
        this.dataSource.data = data;
        console.log(data)
        setTimeout(() => this.dataSource.paginator = this.paginator);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje('Error al cargar los miembros de comisión', true, 'error');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.dataSource.filterPredicate = (data: ComisionMiembroDetalle, filter: string) => {
      const term = filter.toLowerCase();
      return !!(
        data.persona?.solapin?.toLowerCase().includes(term) ||
        data.persona?.nombre?.toLowerCase().includes(term) ||
        data.persona?.apellidos?.toLowerCase().includes(term) ||
        data.persona?.correo?.toLowerCase().includes(term) ||
        data.persona?.cargo?.nombre_cargo?.toLowerCase().includes(term) ||
        data.persona?.estructura?.nombre_estructura?.toLowerCase().includes(term)
      );
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.searchShow = this.dataSource.filteredData.length === 0;
  }

  // Edición inline solo para "es_responsable"
  startEdit(miembro: ComisionMiembroDetalle, field: 'es_responsable'): void {
    this.editingCell = {
      id: miembro.idcomisionmiembro,
      field,
      value: miembro.es_responsable
    };
    this.tempValue = miembro.es_responsable;
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    const updateData: any = { es_responsable: !!this.tempValue };
    this.miembroService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        this.cargarMiembros();
        this.cancelEdit();
        this.notificacionService.mostrarMensaje('Miembro actualizado correctamente', true, 'success');
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al actualizar el miembro', true, 'error');
        this.cancelEdit();
      }
    });
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.tempValue = false;
  }

  isEditing(miembro: ComisionMiembroDetalle, field: string): boolean {
    return this.editingCell?.id === miembro.idcomisionmiembro && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoMiembro(): void {
    const dialogRef = this.dialog.open(ComisionmiembrosForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarMiembros();
    });
  }

  editarMiembro(miembro: ComisionMiembroDetalle): void {
    const dialogRef = this.dialog.open(ComisionmiembrosForm, {
      width: '600px',
      data: miembro,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarMiembros();
    });
  }

  eliminarMiembro(miembro: ComisionMiembroDetalle): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar al miembro ${miembro.persona?.nombre} ${miembro.persona?.apellidos}?`
    ).then(confirmado => {
      if (confirmado) {
        this.miembroService.delete(miembro.idcomisionmiembro).subscribe({
          next: () => {
            this.cargarMiembros();
            this.notificacionService.mostrarMensaje(
              'Miembro eliminado correctamente', true, 'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el miembro', true, 'error'
            );
          }
        });
      }
    });
  }

  getColumnDisplayName(column: string): string {
    const columnNames: { [key: string]: string } = {
      comision: 'Comisión',
      grupo: 'Grupo',
      solapin: 'Solapín',
      nombre: 'Nombre',
      correo: 'Correo',
      cargo: 'Cargo',
      estructura: 'Estructura',
      es_responsable: 'Responsable',
      acciones: 'Acciones'
    };
    return columnNames[column] || column;
  }
}
