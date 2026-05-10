import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../services/roles/role.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { RolFormComponent } from '../role-form/rol-form.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-rol-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  roles: any[] = [];
  filteredRoles: any[] = [];
  isLoading = true;
  searchTerm = '';

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRoles();
    
  }

  private loadRoles(): void {
    this.isLoading = true;
    this.roleService.listAll().subscribe({
      next: (data) => {
        console.log(data);
        this.roles = data;
        this.filteredRoles = [...data];
        this.isLoading = false;
       this.cdr.detectChanges();
        
      },
      error: () => {
        this.isLoading = false;
        this.notificacionService.mostrarMensaje('Error al cargar los roles', true, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredRoles = [...this.roles];
      return;
    }

    const lowerTerm = this.searchTerm.toLowerCase().trim();
    this.filteredRoles = this.roles.filter(role =>
      role.nombre_rol?.toLowerCase().includes(lowerTerm) ||
      role.descripcion?.toLowerCase().includes(lowerTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredRoles = [...this.roles];
  }

  abrirFormularioNuevo(): void {
    const dialogRef = this.dialog.open(RolFormComponent, {
      width: '550px',
      maxWidth: '90vw',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadRoles();
    });
  }

  editarRol(rol: any): void {
    const dialogRef = this.dialog.open(RolFormComponent, {
      width: '550px',
      maxWidth: '90vw',
      data: rol
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadRoles();
    });
  }

  eliminarRol(rol: any): void {
    this.notificacionService.confirmarAccion(
      `¿Eliminar el rol "${rol.nombre_rol || rol.nombre}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.roleService.delete(rol.id_rol).subscribe({
          next: () => {
            this.loadRoles();
            this.notificacionService.mostrarMensaje('Rol eliminado correctamente', true, 'success');
          },
          error: (err) => {
            // ✅ Mostrar mensaje específico del backend
            const msg = err.error?.message || 'Error al eliminar el rol';
            this.notificacionService.mostrarMensaje(msg, true, 'error');
          }
        });
      }
    });
  }
}