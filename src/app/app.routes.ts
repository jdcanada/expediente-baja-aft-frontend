import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PERMISSIONS } from './guards/permissions.constants.guard';

// Componentes
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login-component/login.component';
import { WizardExpedienteComponent } from './components/wizard-expediente/wizard-expediente.component';
import { UsuarioList } from './components/usuario/usuario-list/usuario-list.component';
import { AreaForm } from './components/area/area-form/area-form.component';
import { AreaList } from './components/area/area-list/area-list.component';
import { ComisionList } from './components/comision/comision-list/comision-list.component';
import { DictamenListComponent } from './components/dictamen/dictamen-list/dictamen-list.component';
import { DirectivoList } from './components/directivo/directivo-list/directivo-list.component';
import { ExpedienteListComponent } from './components/expediente/expediente-list/expediente-list.component';
import { MovimientoAFTList } from './components/movimientoaft/movimientoaft-list/movimientoaft-list.component';
import { RolFormComponent } from './components/rol/role-form/rol-form.component';
import { RoleListComponent } from './components/rol/role-list/role-list.component';
import { UsuarioForm } from './components/usuario/usuario-form/usuario-form.component';
import { RolePermisoComponent } from './components/rol/role-prmisos/role-permiso.component';
import { PermisoListComponent } from './components/permiso/permiso-list/permiso-list.component';
import { PermisoFormComponent } from './components/permiso/permiso-form/permiso-form.component';

// CRUD Components (imports omitidos por brevedad...)

export class AppRoutes {
  static getRoutes(): Routes {
    return [
      // Rutas públicas
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },

      // Rutas protegidas (solo autenticación)
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'cargar', component: WizardExpedienteComponent, canActivate: [AuthGuard] },

      // ============================================
      // ADMINISTRACIÓN (requiere permisos específicos)
      // ============================================
      {
        path: 'usuarios/all',
        component: UsuarioList,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.USUARIOS_VER] }
      },
      {
        path: 'usuarios/nuevo',
        component: UsuarioForm,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.USUARIOS_CREAR] }
      },
      {
        path: 'usuarios/editar/:id',
        component: UsuarioForm,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.USUARIOS_EDITAR] }
      },

      // Roles
      {
        path: 'roles/all',
        component: RoleListComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.ROLES_VER] }
      },
      {
        path: 'roles/asignar',
        component: RolFormComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.ROLES_ASIGNAR] }
      },

      {
        path: 'roles/:id/permisos',
        component: RolePermisoComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.ROLES_ASIGNAR] }
      },

      // ============================================
      // CATÁLOGOS (requieren permisos de catálogos)
      // ============================================
      {
        path: 'areas/all',
        component: AreaList,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.AREAS_VER] }
      },
      {
        path: 'areas/nuevo',
        component: AreaForm,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.AREAS_CREAR] }
      },

      // Comisiones (permisos específicos)
      {
        path: 'comisiones/all',
        component: ComisionList,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.COMISIONES_VER] }
      },

      // Directivos (permisos de personas/comisiones)
      {
        path: 'directivos/all',
        component: DirectivoList,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.PERSONAS_VER] }
      },

      // ============================================
      // EXPEDIENTES (requieren permisos de expedientes)
      // ============================================
      {
        path: 'expedientes/all',
        component: ExpedienteListComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.EXPEDIENTES_VER] }
      },
      {
        path: 'dictamenes/all',
        component: DictamenListComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.DICTAMENES_VER] }
      },
      {
        path: 'movimientos-aft/all',
        component: MovimientoAFTList,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.MOVIMIENTOS_VER] }
      },

      // ============================================
      // Permisos (requieren permisos de Permisos)
      // ============================================
      {
        path: 'permisos/all',
        component: PermisoListComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.PERMISOS_VER] }
      },
      {
        path: 'permisos/nuevo',
        component: PermisoFormComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.PERMISOS_CREAR] }
      },
      {
        path: 'permisos/editar/:id',
        component: PermisoFormComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: [PERMISSIONS.PERMISOS_EDITAR] }
      },

      // Redirección
      { path: '**', redirectTo: '/home' }
    ];
  }
}

export const routes = AppRoutes.getRoutes();