import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Verificar si hay token en localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Si está autenticado, retornar true
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Si no está autenticado pero hay token, intentar restaurar sesión
    return this.authService.checkAuthStatus().pipe(
      map(user => {
        if (user) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}