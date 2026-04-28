import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
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
import { UsuarioForm } from '../usuario-form/usuario-form.component';
import { EditableCellUsuario, Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css',
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
export class UsuarioList implements OnInit, AfterViewInit {
  usuarios: Usuario[] = [];
 displayedColumns: string[] = [
  'nombre_usuario',
  'nombre',
  'apellidos',
  'correo',
  'nombre_rol',
  'acciones'
];

  dataSource = new MatTableDataSource<Usuario>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;
  searchShow = false;

  editingCell: EditableCellUsuario | null = null;
  tempValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.listAll().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
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
          'Error al cargar los usuarios',
          true,
          'error'
        );
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const term = filter.toLowerCase();
      return !!(
        data.nombre_usuario?.toLowerCase().includes(term) ||
        data.solapin?.toLowerCase().includes(term) ||
        data.nombre?.toLowerCase().includes(term) ||
        data.apellidos?.toLowerCase().includes(term) ||
        data.nombre_rol?.toLowerCase().includes(term)
      );
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.searchShow = this.dataSource.filteredData.length === 0;
  }

  /* ==================== INLINE EDIT ==================== */
  startEdit(usuario: Usuario, field: keyof Usuario): void {
    if (field !== 'nombre_usuario') return; // Inline edit solo para campo simple
    this.editingCell = {
      id: usuario.idusuario!,
      field,
      value: usuario[field]?.toString() || ''
    };
    this.tempValue = usuario[field]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    const updatedUsuario = this.usuarios.find(u => u.idusuario === this.editingCell!.id);
    if (!updatedUsuario) return;
    const updateData = {
      ...updatedUsuario,
      [this.editingCell.field]: this.tempValue
    };
    this.usuarioService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const idx = this.usuarios.findIndex(u => u.idusuario === this.editingCell!.id);
        if (idx !== -1) {
          this.usuarios[idx] = { ...this.usuarios[idx], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.usuarios];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje('Usuario editado correctamente', true, 'success');
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al editar usuario', true, 'error');
        this.cancelEdit();
      }
    });
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.tempValue = '';
  }

  isEditing(usuario: Usuario, field: keyof Usuario): boolean {
    return this.editingCell?.id === usuario.idusuario && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  /* ============= DIALOG (Crear/Editar/Eliminar) ============= */
  abrirFormularioNuevoUsuario(): void {
    const dialogRef = this.dialog.open(UsuarioForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioForm, {
      width: '600px',
      data: usuario,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el usuario "${usuario.nombre_usuario}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.usuarioService.deleteUser(usuario.idusuario!).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.notificacionService.mostrarMensaje(
              'Usuario eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el usuario',
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
      'nombre_usuario': 'Usuario',
      'solapin' : 'Solapin',
      'nombre' : 'Nombre',
      'apellido' : 'Apellidos',
      'correo': 'Correo',
      'nombre_rol' : 'Rol',
      'nombre_cargo' : 'Cargo',
      'nombre_estructura' : 'Estructura',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
