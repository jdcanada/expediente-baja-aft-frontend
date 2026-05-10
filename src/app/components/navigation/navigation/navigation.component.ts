import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth/auth.service';
import { UserData } from '../../../models/usuario';
import { ThemeSwitcherComponent } from '../../theme-switcher/theme-switcher.component';



@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatExpansionModule,
    MatRippleModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    ThemeSwitcherComponent
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  user: UserData | null = null;
  userAvatar: string | null = null;
  defaultAvatar: string = 'no-image.png'; // 🆕 Ruta de la imagen por defecto
  isCollapsed = false;
  isMobile = false;
  private subscription?: Subscription;
  private routerSubscription?: Subscription;
  openedGroupIndex: number | null = null;
  
  userPermissions: string[] = [];
  permissionsLoaded = false;

  navigationGroups: NavigationGroup[] = [
    {
      title: 'Expedientes',
      icon: 'description',
      items: [
        { label: 'Generar Expediente', icon: 'add', route: '/cargar', tooltip: 'Crear nuevo expediente', permission: 'expedientes.crear' },
        { label: 'Lista de Expedientes', icon: 'folder', route: '/expedientes/all', tooltip: 'Ver todos los expedientes', permission: 'expedientes.ver' },
        { label: 'Dictámenes', icon: 'gavel', route: '/dictamenes/all', tooltip: 'Gestión de dictámenes', permission: 'dictamenes.ver' },
        { label: 'Movimientos AFT', icon: 'swap_horiz', route: '/movimientos-aft/all', tooltip: 'Movimientos AFT', permission: 'movimientos.ver' }
      ]
    },
    {
      title: 'Catálogos',
      icon: 'catalog',
      items: [
        { label: 'Áreas', icon: 'location_city', route: '/areas/all', tooltip: 'Gestión de áreas', permission: 'areas.ver' },
        { label: 'Estructuras', icon: 'account_tree', route: '/estructuras/all', tooltip: 'Estructuras', permission: 'estructuras.ver' },
        { label: 'Entidades', icon: 'account_balance', route: '/entidades/all', tooltip: 'Entidades', permission: 'entidades.ver' },
        { label: 'Clasificaciones', icon: 'category', route: '/clasificacion/all', tooltip: 'Clasificaciones de AFT', permission: 'clasificaciones.ver' },
        { label: 'Características', icon: 'list', route: '/caracteristica/all', tooltip: 'Características', permission: 'caracteristicas.ver' },
        { label: 'Tipos Movimiento', icon: 'moving', route: '/tipos-movimiento/all', tooltip: 'Tipos de movimiento', permission: 'tipos-movimiento.ver' }
      ]
    },
    {
      title: 'Recursos Humanos',
      icon: 'people',
      items: [
        { label: 'Personas', icon: 'person', route: '/personas/all', tooltip: 'Gestión de personas', permission: 'personas.ver' },
        { label: 'Cargos', icon: 'badge', route: '/cargos/all', tooltip: 'Gestión de cargos', permission: 'cargos.ver' },
        { label: 'Directivos', icon: 'supervisor_account', route: '/directivos/all', tooltip: 'Gestión de directivos', permission: 'personas.ver' }
      ]
    },
    {
      title: 'Comisiones',
      icon: 'groups',
      items: [
        { label: 'Comisiones', icon: 'group', route: '/comisiones/all', tooltip: 'Gestión de comisiones', permission: 'comisiones.ver' },
        { label: 'Miembros', icon: 'group_add', route: '/comisionmiembros/all', tooltip: 'Miembros de comisiones', permission: 'comisiones.ver' },
        { label: 'Grupos', icon: 'group_work', route: '/grupo-comisiones/all', tooltip: 'Grupos de comisiones', permission: 'comisiones.ver' }
      ]
    },
    {
      title: 'Administración',
      icon: 'admin_panel_settings',
      items: [
        { label: 'Usuarios', icon: 'manage_accounts', route: '/usuarios/all', tooltip: 'Gestión de usuarios', permission: 'usuarios.ver' },
        { label: 'Roles', icon: 'security', route: '/roles/all', tooltip: 'Gestión de roles', permission: 'roles.ver' },
        { label: 'Permisos', icon: 'lock', route: '/permisos/all', tooltip: 'Gestión de permisos', permission: 'permisos.ver' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.cargarAvatar();
    });
    
    this.authService.permissions$.subscribe(permissions => {
      this.userPermissions = permissions;
      this.permissionsLoaded = true;
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncOpenedGroupWithRoute();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  private checkMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      this.isCollapsed = this.isMobile;
      window.addEventListener('resize', () => {
        this.isMobile = window.innerWidth <= 768;
        if (!this.isMobile && this.isCollapsed) {
          this.isCollapsed = false;
        }
      });
    }
  }

  // Cargar avatar: si hay foto del usuario la usa, si no usa la imagen por defecto
  private cargarAvatar(): void {
    if (this.user?.persona?.foto) {
      this.userAvatar = `assets/users/${this.user.persona.foto}`;
    } else {
      // Usar imagen por defecto
      this.userAvatar = this.defaultAvatar;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // Manejar error de carga de imagen
  handleImageError(event: any): void {
    // Si falla la carga de la imagen, mostrar la imagen por defecto
    event.target.src = this.defaultAvatar;
  }

  getUserInitials(): string {
    if (this.user?.persona?.nombre && this.user?.persona?.apellidos) {
      const nombre = this.user.persona.nombre.trim();
      const apellidos = this.user.persona.apellidos.trim();
      const inicialNombre = nombre.charAt(0).toUpperCase();
      const inicialApellido = apellidos.charAt(0).toUpperCase();
      return `${inicialNombre}${inicialApellido}`;
    }
    return this.user?.nombre_usuario?.charAt(0).toUpperCase() || 'U';
  }

  getUserDisplayName(): string {
    if (this.user?.persona?.nombre && this.user?.persona?.apellidos) {
      return `${this.user.persona.nombre} ${this.user.persona.apellidos}`;
    }
    return this.user?.nombre_usuario || 'Usuario';
  }

  getUserRole(): string {
    return this.user?.nombre_rol || '';
  }

  private syncOpenedGroupWithRoute(): void {
    const url = this.router.url;
    let idx: number | null = null;
    this.navigationGroups.forEach((group, i) => {
      if (group.items.some(item => url.startsWith(item.route))) {
        idx = i;
      }
    });
    this.openedGroupIndex = idx;
  }

  hasPermission(permission?: string): boolean {
    if (!permission) return true;
    
    if (!this.permissionsLoaded) {
      return true;
    }
    
    const userRole = this.user?.nombre_rol?.toUpperCase();
    if (userRole === 'ADMINISTRADOR' || userRole === 'SYSTEM') {
      return true;
    }
    
    return this.userPermissions.includes(permission);
  }

  hasAnyVisibleItem(group: NavigationGroup): boolean {
    if (!this.permissionsLoaded) return true;
    
    const userRole = this.user?.nombre_rol?.toUpperCase();
    if (userRole === 'ADMINISTRADOR' || userRole === 'SYSTEM') {
      return true;
    }
    
    return group.items.some(item => this.hasPermission(item.permission));
  }
}