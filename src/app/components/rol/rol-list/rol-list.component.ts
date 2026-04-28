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

import { EditableCellRol, Rol, RolConUsuarios } from '../../../models/rol';
import { RolService } from '../../../services/rol/rol.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { RolForm } from '../rol-form/rol-form.component';



@Component({
  standalone: true,
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  styleUrls: ['./rol-list.component.css'],
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
export class RolList implements OnInit, AfterViewInit {
  roles: RolConUsuarios[] = [];
  displayedColumns: string[] = ['nombre_rol', 'acciones'];
  dataSource = new MatTableDataSource<RolConUsuarios>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellRol | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private rolService: RolService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarRoles(): void {
    this.loading = true;
    this.rolService.listAll().subscribe({
      next: (data: RolConUsuarios[]) => {
        this.roles = data;
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
          'Error al cargar los roles',
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


  startEdit(rol: Rol, field: keyof Rol): void {
    if (field === 'idrol') return; // No editar ID

    this.editingCell = {
      id: Number(rol.idrol),
      field: field,
      value: rol[field]?.toString() || ''
    };
    this.tempValue = rol[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.roles.find(r => r.idrol === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.rolService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.roles.findIndex(r => r.idrol === this.editingCell!.id);
        if (index !== -1) {
          this.roles[index] = { ...this.roles[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.roles];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Rol actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el rol',
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

  isEditing(rol: Rol, field: keyof Rol): boolean {
    return this.editingCell?.id === rol.idrol && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoRol(): void {
    const dialogRef = this.dialog.open(RolForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRoles();
      }
    });
  }

  editarRol(rol: Rol): void {
    const dialogRef = this.dialog.open(RolForm, {
      width: '600px',
      data: rol,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRoles();
      }
    });
  }

  eliminarRol(rol: Rol): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el rol "${rol.nombre_rol}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.rolService.delete(Number(rol.idrol)).subscribe({
          next: () => {
            this.cargarRoles();
            this.notificacionService.mostrarMensaje(
              'Rol eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el rol',
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
      'idrol': 'ID',
      'nombre_rol': 'Nombre del Rol',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
