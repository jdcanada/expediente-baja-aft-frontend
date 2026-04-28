import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationComponent } from './components/navigation/navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { DictamenTecnico } from './models/dictamentecnico';
import { ExpedienteFormulario } from './models/expedienteformulario';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [
    RouterOutlet,
    NavigationComponent,
    CommonModule,
    RouterModule
  ],
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'expediente-baja-aft';

  datosExpediente = {
    expedienteNo: 'EXP-2025-001',
    fecha_creacion: '2025-06-19',
    cargoJefeAprueba: 'Director General',
    nombreJefeAprueba: 'Juan Pérez',
    nombreJefeComision: 'María Gómez'
  };

  listaDictamenes: DictamenTecnico[] = [];

  showNav = true;
  esLogin = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    // Controla mostrar menú de navegación solo en rutas distintas a login
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNav = event.urlAfterRedirects !== '/login';
      this.esLogin = event.urlAfterRedirects === '/login';
    });
  }

  ngOnInit(): void {
    // Llamada única para consultar estado auth al iniciar la aplicación
    this.authService.checkAuthStatus().subscribe({
      next: user => {
        // Opcional: aquí puedes reaccionar si quieres
        if (user) {
          console.log('AppComponent: Usuario autenticado', user);
        } else {
          console.log('AppComponent: Usuario no autenticado');
        }
      },
      error: err => {
        console.error('AppComponent: Error al verificar autenticación', err);
      }
    });
  }

  // Método que se llama al cargar el Excel (ya implementado)
  onFormularioCompletado(event: Event) {
    const formulario = event as unknown as ExpedienteFormulario;
    this.listaDictamenes = formulario.dictamenes || [];

    this.datosExpediente = {
      expedienteNo: formulario.no_expediente,
      fecha_creacion: formulario.fecha_creacion,
      cargoJefeAprueba: formulario.cargoJefeAprueba,
      nombreJefeAprueba: formulario.nombreJefeAprueba,
      nombreJefeComision: formulario.jefeComision,
    };
  }
}
