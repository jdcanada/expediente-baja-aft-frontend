import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


interface UserData {
  nombre: string;
  apellidos: string;
  foto?: string;
  role?: string | null;
  // otros campos que quieras mostrar...
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  private authStatusLoaded = false;

  public user$ = this.userSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
  public role$ = this.roleSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly AUTH_STATUS_URL = '/auth/status';

  constructor(private http: HttpClient) { }

  checkAuthStatus(): Observable<UserData | null> {
    if (this.authStatusLoaded) {
      // Ya cargamos antes el estado, devolvemos observable sin llamar nuevamente
      return this.user$;
    }
    this.authStatusLoaded = true;

    return this.http.get<UserData>(this.AUTH_STATUS_URL, { withCredentials: true }).pipe(
      tap(userData => {
        //console.log('AuthService: Cargando usuario:', userData);
        if (userData && userData.nombre) {
          this.userSubject.next(userData);
          this.roleSubject.next(userData.role || null);
          this.isAuthenticatedSubject.next(true);
        } else {
          this.clearAuthState();
        }
      }),
      catchError((err) => {
        console.log('AuthService: Error en checkAuthStatus, limpiando estado', err);
        this.clearAuthState();
        return of(null);
      })
    );
  }

  getCurrentUser(): UserData | null {
    return this.userSubject.value;
  }

  getCurrentRole(): string | null {
    return this.roleSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private clearAuthState(): void {
    console.log('AuthService: Limpiando estado de autenticación');
    this.userSubject.next(null);
    this.roleSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  resetAuthStatus(): void {
    this.authStatusLoaded = false;
    this.clearAuthState();
  }


  /** Logout: navegar a ruta relativa para usar proxy */
  logout(): void {
    window.location.href = '/auth/logout';
  }
}
