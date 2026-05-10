import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PermisoService } from '../../../services/permiso/permiso.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { AuthService } from '../../../services/auth/auth.service';
import { PermisoFormComponent } from '../permiso-form/permiso-form.component';
import { TarjetaPermiso, PermisoItem } from '../../../models/permiso';

// ✅ Mismo mapeo de grupos que en RolePermisoComponent
const GRUPOS_ENTIDADES: { nombre: string, icono: string, descripcion: string, patrones: string[], modulo: string }[] = [
  { nombre: 'Usuarios', icono: 'people', descripcion: 'Gestión de usuarios del sistema', patrones: ['usuarios.'], modulo: 'usuarios' },
  { nombre: 'Roles', icono: 'admin_panel_settings', descripcion: 'Gestión de roles y permisos', patrones: ['roles.'], modulo: 'seguridad' },
  { nombre: 'Expedientes', icono: 'folder', descripcion: 'Gestión de expedientes de baja', patrones: ['expedientes.'], modulo: 'expedientes' },
  { nombre: 'Dictámenes', icono: 'gavel', descripcion: 'Gestión de dictámenes técnicos', patrones: ['dictamenes.'], modulo: 'dictamenes' },
  { nombre: 'Movimientos', icono: 'swap_horiz', descripcion: 'Gestión de movimientos contables', patrones: ['movimientos.'], modulo: 'movimientos' },
  { nombre: 'Personas', icono: 'person', descripcion: 'Gestión de personas', patrones: ['personas.'], modulo: 'catalogos' },
  { nombre: 'Cargos', icono: 'badge', descripcion: 'Gestión de cargos', patrones: ['cargos.'], modulo: 'catalogos' },
  { nombre: 'Áreas', icono: 'location_city', descripcion: 'Gestión de áreas', patrones: ['areas.'], modulo: 'catalogos' },
  { nombre: 'Estructuras', icono: 'account_tree', descripcion: 'Gestión de estructuras', patrones: ['estructuras.'], modulo: 'catalogos' },
  { nombre: 'Comisiones', icono: 'groups', descripcion: 'Gestión de comisiones', patrones: ['comisiones.'], modulo: 'comisiones' },
  { nombre: 'Grupos Comisión', icono: 'group_work', descripcion: 'Gestión de grupos de comisión', patrones: ['grupos-comision.'], modulo: 'comisiones' },
  { nombre: 'Características', icono: 'list', descripcion: 'Gestión de características de AFT', patrones: ['caracteristicas.'], modulo: 'catalogos' },
  { nombre: 'Clasificaciones', icono: 'category', descripcion: 'Gestión de clasificaciones de AFT', patrones: ['clasificaciones.'], modulo: 'catalogos' },
  { nombre: 'Entidades', icono: 'account_balance', descripcion: 'Gestión de entidades', patrones: ['entidades.'], modulo: 'catalogos' },
  { nombre: 'Destinos Finales', icono: 'location_on', descripcion: 'Gestión de destinos finales', patrones: ['destinos-finales.'], modulo: 'catalogos' },
  { nombre: 'Tipos Movimiento', icono: 'moving', descripcion: 'Gestión de tipos de movimiento', patrones: ['tipos-movimiento.'], modulo: 'catalogos' },
  { nombre: 'Medios Básicos', icono: 'inventory', descripcion: 'Gestión de medios básicos (AFT)', patrones: ['medios-baja.'], modulo: 'medios' },
  { nombre: 'Reportes', icono: 'assessment', descripcion: 'Generación de reportes', patrones: ['reportes.'], modulo: 'reportes' },
  { nombre: 'Configuración', icono: 'settings', descripcion: 'Configuración del sistema', patrones: ['configuracion.'], modulo: 'configuracion' }
];


@Component({
  selector: 'app-permiso-list',
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
  templateUrl: './permiso-list.component.html',
  styleUrls: ['./permiso-list.component.css']
})
export class PermisoListComponent implements OnInit {
  tarjetas: TarjetaPermiso[] = [];
  filteredTarjetas: TarjetaPermiso[] = [];
  isLoading = true;
  searchTerm = '';

  constructor(
    private permisoService: PermisoService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPermisos();
  }

  private loadPermisos(): void {
    this.isLoading = true;
    this.permisoService.getPermisosPorModulo().subscribe({
      next: (data: any[]) => {
        const todosPermisos: PermisoItem[] = [];
        for (const modulo of data) {
          for (const permiso of modulo.permisos) {
            todosPermisos.push({
              id_permiso: permiso.id_permiso,
              codigo: permiso.codigo,
              nombre: permiso.nombre,
              descripcion: permiso.descripcion || '',
              modulo: permiso.modulo
            });
          }
        }
        
        this.tarjetas = [];
        
        for (const grupo of GRUPOS_ENTIDADES) {
          const permisosGrupo = todosPermisos.filter(permiso => {
            return grupo.patrones.some(patron => permiso.codigo.startsWith(patron));
          });
          
          if (permisosGrupo.length > 0) {
            this.tarjetas.push({
              nombre: grupo.nombre,
              icono: grupo.icono,
              descripcion: grupo.descripcion,
              modulo: grupo.modulo,
              permisos: permisosGrupo
            });
          }
        }
        
        this.filteredTarjetas = [...this.tarjetas];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.notificacionService.mostrarMensaje('Error al cargar permisos', true, 'error');
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredTarjetas = [...this.tarjetas];
      return;
    }
    
    const lowerTerm = this.searchTerm.toLowerCase().trim();
    this.filteredTarjetas = this.tarjetas
      .map(tarjeta => ({
        ...tarjeta,
        permisos: tarjeta.permisos.filter(p => 
          p.nombre?.toLowerCase().includes(lowerTerm) ||
          p.codigo?.toLowerCase().includes(lowerTerm) ||
          p.descripcion?.toLowerCase().includes(lowerTerm)
        )
      }))
      .filter(tarjeta => tarjeta.permisos.length > 0);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredTarjetas = [...this.tarjetas];
  }

  abrirFormularioNuevo(): void {
    const dialogRef = this.dialog.open(PermisoFormComponent, {
      width: '550px',
      maxWidth: '90vw',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPermisos();
    });
  }

  // ✅ Método para agregar un nuevo permiso a un grupo específico
  editarTarjeta(tarjeta: TarjetaPermiso): void {
    // Pre-cargar el módulo basado en el grupo
    const nuevoPermiso = {
      modulo: tarjeta.modulo,
      codigo: '',
      nombre: '',
      descripcion: ''
    };
    
    const dialogRef = this.dialog.open(PermisoFormComponent, {
      width: '550px',
      maxWidth: '90vw',
      data: nuevoPermiso
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPermisos();
    });
  }

  editarPermiso(permiso: PermisoItem): void {
    const dialogRef = this.dialog.open(PermisoFormComponent, {
      width: '550px',
      maxWidth: '90vw',
      data: permiso
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadPermisos();
    });
  }

  eliminarPermiso(permiso: PermisoItem): void {
    this.notificacionService.confirmarAccion(`¿Eliminar el permiso "${permiso.nombre}"?`).then(confirmado => {
      if (confirmado) {
        this.permisoService.delete(permiso.id_permiso).subscribe({
          next: () => {
            this.loadPermisos();
            this.notificacionService.mostrarMensaje('Permiso eliminado correctamente', true, 'success');
          },
          error: () => {
            this.notificacionService.mostrarMensaje('Error al eliminar el permiso', true, 'error');
          }
        });
      }
    });
  }
}