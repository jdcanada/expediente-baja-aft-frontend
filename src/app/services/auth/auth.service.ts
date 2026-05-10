import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserData, LoginResponse } from '../../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;
  
  private userSubject = new BehaviorSubject<UserData | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private roleIdSubject = new BehaviorSubject<number| string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  private themePreferenceSubject = new BehaviorSubject<'dark' | 'light'>('dark');
  private authStatusLoaded = false;

  public user$ = this.userSubject.asObservable();
  public role$ = this.roleSubject.asObservable();
  public roleId$ = this.roleIdSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public permissions$ = this.permissionsSubject.asObservable();
  public themePreference$ = this.themePreferenceSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.tokenSubject.next(savedToken);
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token && this.isBrowser) {
          this.tokenSubject.next(response.token);
          localStorage.setItem('token', response.token);
          this.userSubject.next(response.user);
          
          const userRole = response.user.nombre_rol || null;
          const userRoleId = response.user.id_rol ?? null;  // ✅ Usar ?? para manejar undefined
          const themePreference = (response.user.theme_preference as 'dark' | 'light') || 'dark';
          
          this.roleSubject.next(userRole);
          this.roleIdSubject.next(userRoleId);
          this.themePreferenceSubject.next(themePreference);
          this.isAuthenticatedSubject.next(true);
          
          
          // Aplicar tema desde la BD
          this.applyTheme(themePreference);
          
          // ✅ Verificar que userRoleId sea un número válido antes de usarlo
          if (userRoleId && typeof userRoleId === 'number') {
            this.cargarPermisosPorId(userRoleId);
          } else {
            this.permissionsSubject.next([]);
          }
        }
      }),
      catchError((err) => {
        return of(err);
      })
    );
  }

  // Aplicar tema al body
  private applyTheme(theme: 'dark' | 'light'): void {
    if (!this.isBrowser) return;
    
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }

  // Actualizar preferencia de tema en el backend
  updateThemePreference(theme: 'dark' | 'light'): Observable<any> {
    this.themePreferenceSubject.next(theme);
    this.applyTheme(theme);
    
    return this.http.put(`${this.apiUrl}/usuarios/theme`, { theme_preference: theme }).pipe(
      tap(() => {
        const currentUser = this.userSubject.value;
        if (currentUser) {
          this.userSubject.next({ ...currentUser, theme_preference: theme });
        }
      }),
      catchError((err) => {
        return of(err);
      })
    );
  }

  checkAuthStatus(): Observable<UserData | null> {
    if (this.authStatusLoaded && this.isAuthenticatedSubject.value) {
      return this.user$;
    }
    
    this.authStatusLoaded = true;
    const token = this.getToken();
    
    if (!token) {
      this.clearAuthState();
      return of(null);
    }
    
    return this.http.get<UserData>(`${this.apiUrl}/auth/me`).pipe(
      tap(userData => {
        if (userData && userData.id_usuario) {
          this.userSubject.next(userData);
          const userRole = userData.nombre_rol || null;
          const userRoleId = userData.id_rol ?? null;  // ✅ Usar ?? para manejar undefined
          
          this.roleSubject.next(userRole);
          this.roleIdSubject.next(userRoleId);
          this.isAuthenticatedSubject.next(true);
          
          // ✅ Verificar que userRoleId sea un número válido
          if (userRoleId && typeof userRoleId === 'number') {
            this.cargarPermisosPorId(userRoleId);
          } else {
            this.permissionsSubject.next([]);
          }
        } else {
          this.clearAuthState();
        }
      }),
      catchError((err) => {
        this.clearAuthState();
        return of(null);
      })
    );
  }

  // Cargar permisos usando el ID del rol
  private cargarPermisosPorId(rolId: number): void {
    if (!rolId || typeof rolId !== 'number') {
      this.permissionsSubject.next([]);
      return;
    }
    
    
    this.http.get<string[]>(`${this.apiUrl}/permisos/rol/${rolId}`).subscribe({
      next: (permisos) => {
        this.permissionsSubject.next(permisos);
      },
      error: (err) => {
        this.permissionsSubject.next([]);
      }
    });
  }

  hasPermission(permiso: string): boolean {
    return this.permissionsSubject.value.includes(permiso);
  }

  hasAnyPermission(permisos: string[]): boolean {
    return permisos.some(p => this.permissionsSubject.value.includes(p));
  }

  hasAllPermissions(permisos: string[]): boolean {
    return permisos.every(p => this.permissionsSubject.value.includes(p));
  }

  logout(): void {
    this.clearAuthState();
    
    const token = this.getToken();
    if (token && this.isBrowser) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
        next: () => {
        },
        error: (err) => {
        }
      });
    }
    
    if (this.isBrowser) {
      this.router.navigate(['/login']);
    }
  }

  clearAuthState(): void {
    this.authStatusLoaded = false;
    this.userSubject.next(null);
    this.roleSubject.next(null);
    this.roleIdSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.tokenSubject.next(null);
    this.permissionsSubject.next([]);
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return this.tokenSubject.value || localStorage.getItem('token');
    }
    return this.tokenSubject.value;
  }

  getCurrentUser(): UserData | null {
    return this.userSubject.value;
  }

  getCurrentRole(): string | null {
    return this.roleSubject.value;
  }

  getCurrentRoleId(): number| string | null {
    return this.roleIdSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value && !!this.getToken();
  }

  resetAuthStatus(): void {
    this.authStatusLoaded = false;
    this.clearAuthState();
  }
}