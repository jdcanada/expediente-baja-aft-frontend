// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { AuthService } from '../services/auth/auth.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Obtener token del servicio
//     const token = this.authService.getToken();
    
    
//     // Clonar la request y añadir el token si existe
//     let authReq = req;
//     if (token) {
//       authReq = req.clone({
//         setHeaders: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//     }

//     return next.handle(authReq).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Interceptor - Error:', error.status, error.statusText);
//         if (error.status === 401) {
//           // Token expirado o no autorizado
//           this.authService.clearAuthState();
//           this.router.navigate(['/login']);
//         }
//         return throwError(() => error);
//       })
//     );
//   }
// }