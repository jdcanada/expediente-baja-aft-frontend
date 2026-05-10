import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  
  // Clonar la request y añadir el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  return next(authReq).pipe(
    catchError((error) => {
      console.error('Interceptor FN - Error:', error.status, error.statusText);
      if (error.status === 401) {
        // Token expirado o no autorizado
        authService.clearAuthState();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};