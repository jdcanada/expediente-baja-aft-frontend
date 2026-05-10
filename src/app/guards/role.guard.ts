import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { UserData } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const expectedRoles = route.data['roles'] as Array<string>;
    
    // Si no hay roles requeridos, permitir acceso
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }
    
    
    // Convertir roles esperados a minúsculas para comparación insensible
    const expectedRolesLower = expectedRoles.map(r => r.toLowerCase());
    
    // Intentar obtener el usuario actual de forma síncrona
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.nombre_rol) {
      const userRoleLower = currentUser.nombre_rol.toLowerCase();
      const hasRole = expectedRolesLower.includes(userRoleLower);
      
      if (hasRole) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    }
    
    // Si no hay usuario sincrónicamente, esperar al observable
    
    return this.authService.user$.pipe(
      take(1),
      tap(),
      map(user => {
        // Verificar si el usuario existe y tiene rol
        if (!user || !user.nombre_rol) {
          
          // Intentar obtener el rol del token como fallback
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const rolFromToken = payload.nombre_rol;
              
              if (rolFromToken) {
                const roleLower = rolFromToken.toLowerCase();
                const hasRole = expectedRolesLower.includes(roleLower);
                if (hasRole) {
                  return true;
                }
              }
            } catch (e) {
              console.error('RoleGuard - Error decoding token:', e);
            }
          }
          
          this.router.navigate(['/home']);
          return false;
        }
        
        const userRoleLower = user.nombre_rol.toLowerCase();
        const hasRole = expectedRolesLower.includes(userRoleLower);
        
        
        if (hasRole) {
          return true;
        }
        
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}