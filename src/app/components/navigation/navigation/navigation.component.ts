import { Component, OnInit, OnDestroy, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth/auth.service';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  tooltip?: string;
}

interface NavigationGroup {
  title: string;
  icon: string;
  items: NavigationItem[];
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatExpansionModule,
    MatRippleModule,
    MatTooltipModule
  ],
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
 userLogin: any;  // Guardamos los datos recibidos aquí

  isCollapsed = false;
  private subscription?: Subscription;
  openedGroupIndex: number | null = null;

  navigationGroups: NavigationGroup[] = [
    {
      title: 'Personas y Usuarios',
      icon: 'people',
      items: [
        { label: 'Personas', icon: 'person', route: '/personas/all', tooltip: 'Gestión de personas' },
        { label: 'Cargos', icon: 'badge', route: '/cargos/all', tooltip: 'Gestión de cargos' },
        { label: 'Directivos', icon: 'supervisor_account', route: '/directivos/all', tooltip: 'Gestión de directivos' },
        { label: 'Miembros Comisión', icon: 'group_add', route: '/comisionmiembros/all', tooltip: 'Miembros de comisiones' },
        { label: 'Comisiones', icon: 'groups', route: '/comisiones/all', tooltip: 'Gestión de comisiones' },
        { label: 'Grupo Comisiones', icon: 'group_work', route: '/grupo-comisiones/all', tooltip: 'Grupos de comisiones' },
        { label: 'Usuarios', icon: 'manage_accounts', route: '/usuarios/all', tooltip: 'Gestión de usuarios' },
        { label: 'Roles', icon: 'security', route: '/roles/all', tooltip: 'Gestión de roles' }
      ]
    },
    {
      title: 'Documentos y Movimientos',
      icon: 'description',
      items: [
        { label: 'Expedientes', icon: 'folder', route: '/expedientes/all', tooltip: 'Generar expedientes' },
        { label: 'Dictámenes', icon: 'gavel', route: '/dictamenes/all', tooltip: 'Gestión de dictámenes' },
        { label: 'Informes Resumen', icon: 'summarize', route: '/informes-resumen/all', tooltip: 'Informes resumen' },
        { label: 'Movimientos AFT', icon: 'swap_horiz', route: '/movimientos-aft/all', tooltip: 'Movimientos AFT' },
        { label: 'Tipos Movimiento', icon: 'moving', route: '/tipos-movimiento/all', tooltip: 'Tipos de movimiento' }
      ]
    },
    {
      title: 'Medios Básicos',
      icon: 'inventory_2',
      items: [
        { label: 'Medios Básicos', icon: 'inventory', route: '/medio-basicos/all', tooltip: 'Gestión de medios básicos' },
        { label: 'Características', icon: 'list', route: '/caracteristica/all', tooltip: 'Características' },
        { label: 'Clasificaciones', icon: 'category', route: '/clasificacion/all', tooltip: 'Clasificaciones' }
      ]
    },
    {
      title: 'Entidades y Estructuras',
      icon: 'account_tree',
      items: [
        { label: 'Entidades', icon: 'account_balance', route: '/entidades/all', tooltip: 'Gestión de entidades' },
        { label: 'Estructuras', icon: 'account_tree', route: '/estructuras/all', tooltip: 'Estructuras organizacionales' },
        { label: 'Áreas', icon: 'location_city', route: '/areas/all', tooltip: 'Gestión de áreas' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authservice: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

   ngOnInit(): void {
  this.subscription = this.authservice.user$.subscribe(user => {
    setTimeout(() => {
      this.userLogin = user;
      this.cdRef.markForCheck(); // si usas OnPush, opcional
      //console.log('Usuario cargado:', user);
    });
  });
}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.syncOpenedGroupWithRoute();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authservice.logout();
    this.router.navigate(['/login']);
  }

  showImage(): string {
    if (this.userLogin?.foto) {
      return `assets/users/${this.userLogin.foto}`;
    }
    return 'no-image.png';
  }

  getUserDisplayName(): string {
    if (this.userLogin && this.userLogin.nombre && this.userLogin.apellidos) {
      return `${this.userLogin.nombre} ${this.userLogin.apellidos}`;
    }
    
    return 'Usuario';
  }

  private syncOpenedGroupWithRoute() {
    // No setTimeout aquí, para que el valor esté listo antes del render
    const url = this.router.url;
    let idx: number | null = null;
    this.navigationGroups.forEach((group, i) => {
      if (group.items.some(item => url.startsWith(item.route))) {
        idx = i;
      }
    });
    this.openedGroupIndex = idx;
  }
}