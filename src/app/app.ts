import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationComponent } from './components/navigation/navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { DictamenTecnico } from './models/dictamen';
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

  showNav = false;
  esLogin = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.actualizarEstadoPorRuta(event.urlAfterRedirects);
    });
  }

  ngOnInit(): void {
    // Verificar autenticación al inicio
    this.authService.checkAuthStatus().subscribe(user => {
      this.actualizarEstadoPorRuta(this.router.url);
    });
  }


    private actualizarEstadoPorRuta(url: string): void {
    // Verificar si la URL contiene 'login' (puede tener query params como ?returnUrl=)
    const esPaginaLogin = url.includes('/login');
    const estaAutenticado = this.authService.isLoggedIn();
    
    this.esLogin = esPaginaLogin;
    // Solo mostrar nav si NO es login Y está autenticado
    this.showNav = !esPaginaLogin && estaAutenticado;
  }



  // Método que se llama al cargar el Excel (ya implementado)
  onFormularioCompletado(event: Event) {
    const formulario = event as unknown as ExpedienteFormulario;
    this.listaDictamenes = formulario.dictamenes || [];

    this.datosExpediente = {
      expedienteNo: formulario.numero_expediente,
      fecha_creacion: formulario.fecha_creacion,
      cargoJefeAprueba: formulario.cargoJefeAprueba,
      nombreJefeAprueba: formulario.nombreJefeAprueba,
      nombreJefeComision: formulario.jefeComision,
    };
  }
}
