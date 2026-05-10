import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('dark');
  public currentTheme$ = this.currentThemeSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initTheme();
  }

  private initTheme(): void {
    if (!this.isBrowser) return;
    
    // Suscribirse a cambios del usuario para obtener tema desde BD
    this.authService.user$.subscribe(user => {
      if (user?.theme_preference) {
        this.setTheme(user.theme_preference, false);
      } else {
        // Fallback a localStorage o preferencia del sistema
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
          this.setTheme(savedTheme, false);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.setTheme(prefersDark ? 'dark' : 'light', false);
        }
      }
    });
  }

  setTheme(theme: Theme, saveToBackend: boolean = true): void {
    if (!this.isBrowser) return;
    
    this.currentThemeSubject.next(theme);
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
    
    if (saveToBackend && this.authService.isLoggedIn()) {
      this.authService.updateThemePreference(theme).subscribe();
    }
  }

  toggleTheme(): void {
    const current = this.currentThemeSubject.value;
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme, true);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }
}