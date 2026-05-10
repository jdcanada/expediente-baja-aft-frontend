import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Obtener los permisos requeridos de la ruta
    const requiredPermissions = route.data['permissions'] as string[];
    
    // Si no hay permisos requeridos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Obtener permisos del usuario desde el servicio (vienen de la BD)
    return this.authService.permissions$.pipe(
      take(1),
      map(userPermissions => {
        // Verificar si el usuario tiene ALGUNO de los permisos requeridos
        const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));
        
        if (hasPermission) {
          return true;
        }
        
        // Si no tiene permisos, redirigir a home
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}