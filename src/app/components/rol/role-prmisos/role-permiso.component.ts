import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { RoleService } from '../../../services/roles/role.service';
import { PermisoService } from '../../../services/permiso/permiso.service';
import { PermisoItem } from '../../../models/permiso';
import { Rol } from '../../../models/role';

// ✅ Grupo de permisos (estático, sin permisos)
interface GrupoConfig {
  nombre: string;
  icono: string;
  patrones: string[];
}

// ✅ Grupo con permisos (dinámico)
interface GrupoPermiso {
  nombre: string;
  icono: string;
  patrones: string[];
  permisos: PermisoItem[];
}

// ✅ Bloque de permisos
interface BloquePermisos {
  nombre: string;
  icono: string;
  descripcion: string;
  grupos: GrupoConfig[];
}

// ✅ Configuración estática de bloques y grupos (sin permisos)
const BLOQUES_CONFIG: BloquePermisos[] = [
  {
    nombre: 'Expedientes',
    icono: 'folder',
    descripcion: 'Gestión de expedientes y documentos asociados',
    grupos: [
      { nombre: 'Expedientes', icono: 'folder', patrones: ['expedientes.'] },
      { nombre: 'Dictámenes', icono: 'gavel', patrones: ['dictamenes.'] },
      { nombre: 'Movimientos', icono: 'swap_horiz', patrones: ['movimientos.'] }
    ]
  },
  {
    nombre: 'Institución',
    icono: 'account_balance',
    descripcion: 'Estructura organizacional de la institución',
    grupos: [
      { nombre: 'Entidades', icono: 'account_balance', patrones: ['entidades.'] },
      { nombre: 'Estructuras', icono: 'account_tree', patrones: ['estructuras.'] },
      { nombre: 'Áreas', icono: 'location_city', patrones: ['areas.'] },
      { nombre: 'Medios Básicos', icono: 'inventory', patrones: ['medios-baja.'] }
    ]
  },
  {
    nombre: 'Recursos Humanos',
    icono: 'people',
    descripcion: 'Gestión de personas, cargos y comisiones',
    grupos: [
      { nombre: 'Personas', icono: 'person', patrones: ['personas.'] },
      { nombre: 'Cargos', icono: 'badge', patrones: ['cargos.'] },
      { nombre: 'Comisiones', icono: 'groups', patrones: ['comisiones.'] },
      { nombre: 'Grupos Comisión', icono: 'group_work', patrones: ['grupos-comision.'] }
    ]
  },
  {
    nombre: 'Catálogos',
    icono: 'list_alt',
    descripcion: 'Catálogos y clasificaciones del sistema',
    grupos: [
      { nombre: 'Clasificaciones', icono: 'category', patrones: ['clasificaciones.'] },
      { nombre: 'Características', icono: 'list', patrones: ['caracteristicas.'] },
      { nombre: 'Destinos Finales', icono: 'location_on', patrones: ['destinos-finales.'] },
      { nombre: 'Tipos Movimiento', icono: 'moving', patrones: ['tipos-movimiento.'] }
    ]
  },
  {
    nombre: 'Administración',
    icono: 'admin_panel_settings',
    descripcion: 'Configuración y seguridad del sistema',
    grupos: [
      { nombre: 'Usuarios', icono: 'people', patrones: ['usuarios.'] },
      { nombre: 'Roles', icono: 'admin_panel_settings', patrones: ['roles.'] },
      { nombre: 'Reportes', icono: 'assessment', patrones: ['reportes.'] },
      { nombre: 'Configuración', icono: 'settings', patrones: ['configuracion.'] }
    ]
  }
];

@Component({
  selector: 'app-role-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './role-permiso.component.html',
  styleUrls: ['./role-permiso.component.css']
})
export class RolePermisoComponent implements OnInit {
  roleId: number | null = null;
  role: Rol | null = null;
  bloques: { nombre: string; icono: string; descripcion: string; grupos: GrupoPermiso[] }[] = [];
  isLoading = true;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private permisoService: PermisoService,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.roleId = parseInt(idParam, 10);
      
      if (isNaN(this.roleId) || this.roleId < 0) {
        this.notificacionService.mostrarMensaje('ID de rol inválido', true, 'error');
        this.router.navigate(['/roles/all']);
        return;
      }
      
      this.loadData();
    } else {
      this.notificacionService.mostrarMensaje('No se especificó un rol', true, 'error');
      this.router.navigate(['/roles/all']);
    }
  }

  private loadData(): void {
    if (this.roleId === null || this.roleId === undefined) return;
    
    // Cargar datos del rol
    this.roleService.getById(this.roleId).subscribe({
      next: (rol) => {
        this.role = rol;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el rol:', err);
        this.notificacionService.mostrarMensaje('Error al cargar el rol', true, 'error');
      }
    });

    // Cargar permisos del rol
    this.permisoService.getPermisosByRol(this.roleId).subscribe({
      next: (permisosAsignados: string[]) => {
        const permisosSet = new Set(permisosAsignados);
        
        // Cargar TODOS los permisos desde la base de datos
        this.permisoService.getPermisosPorModulo().subscribe({
          next: (data: any[]) => {
            // Recolectar todos los permisos
            const todosPermisos: PermisoItem[] = [];
            for (const modulo of data) {
              for (const permiso of modulo.permisos) {
                todosPermisos.push({
                  id_permiso: permiso.id_permiso,
                  codigo: permiso.codigo,
                  nombre: permiso.nombre,
                  descripcion: permiso.descripcion || '',
                  modulo: permiso.modulo,
                  asignado: permisosSet.has(permiso.codigo)
                });
              }
            }
            
            // Construir la estructura de bloques con sus permisos
            this.bloques = [];
            
            for (const bloqueConfig of BLOQUES_CONFIG) {
              const gruposConPermisos: GrupoPermiso[] = [];
              
              for (const grupoConfig of bloqueConfig.grupos) {
                // Recolectar permisos que coinciden con los patrones del grupo
                const permisosGrupo: PermisoItem[] = [];
                
                for (const patron of grupoConfig.patrones) {
                  for (const permiso of todosPermisos) {
                    if (permiso.codigo.startsWith(patron)) {
                      permisosGrupo.push(permiso);
                    }
                  }
                }
                
                if (permisosGrupo.length > 0) {
                  gruposConPermisos.push({
                    nombre: grupoConfig.nombre,
                    icono: grupoConfig.icono,
                    patrones: grupoConfig.patrones,
                    permisos: permisosGrupo
                  });
                }
              }
              
              if (gruposConPermisos.length > 0) {
                this.bloques.push({
                  nombre: bloqueConfig.nombre,
                  icono: bloqueConfig.icono,
                  descripcion: bloqueConfig.descripcion,
                  grupos: gruposConPermisos
                });
              }
            }
            
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error cargando todos los permisos:', err);
            this.isLoading = false;
            this.notificacionService.mostrarMensaje('Error al cargar permisos', true, 'error');
          }
        });
      },
      error: (err) => {
        console.error('Error cargando permisos del rol:', err);
        this.isLoading = false;
        this.notificacionService.mostrarMensaje('Error al cargar permisos del rol', true, 'error');
      }
    });
  }

  togglePermiso(permiso: PermisoItem): void {
    permiso.asignado = !permiso.asignado;
  }

  savePermisos(): void {
    const allPermisos: PermisoItem[] = [];
    for (const bloque of this.bloques) {
      for (const grupo of bloque.grupos) {
        allPermisos.push(...grupo.permisos);
      }
    }
    
    this.isSaving = true;
    
    this.permisoService.getPermisosByRol(this.roleId!).subscribe({
      next: (permisosActuales: string[]) => {
        const permisosActualesSet = new Set(permisosActuales);
        
        const permisosAAgregar = allPermisos.filter(p => 
          p.asignado && !permisosActualesSet.has(p.codigo)
        );
        
        const permisosARemover = allPermisos.filter(p => 
          !p.asignado && permisosActualesSet.has(p.codigo)
        );
        
        const observables: any[] = [];
        
        for (const permiso of permisosAAgregar) {
          observables.push(this.permisoService.asignarPermiso(this.roleId!, permiso.id_permiso));
        }
        
        for (const permiso of permisosARemover) {
          observables.push(this.permisoService.removerPermiso(this.roleId!, permiso.id_permiso));
        }
        
        if (observables.length === 0) {
          this.isSaving = false;
          this.notificacionService.mostrarMensaje('No hay cambios para guardar', true, 'info');
          return;
        }
        
        Promise.all(observables.map(obs => obs.toPromise())).then(() => {
          this.isSaving = false;
          this.notificacionService.mostrarMensaje(
            `Permisos actualizados correctamente para ${this.role?.nombre_rol}`,
            true,
            'success'
          );
          this.router.navigate(['/roles/all']);
        }).catch((err) => {
          console.error('Error guardando permisos:', err);
          this.isSaving = false;
          this.notificacionService.mostrarMensaje('Error al actualizar permisos', true, 'error');
        });
      },
      error: (err) => {
        console.error('Error cargando permisos actuales:', err);
        this.isSaving = false;
        this.notificacionService.mostrarMensaje('Error al cargar permisos actuales', true, 'error');
      }
    });
  }

  // ✅ Método cancelar - navega de vuelta a la lista de roles
  cancelar(): void {
    this.router.navigate(['/roles/all']);
  }
}