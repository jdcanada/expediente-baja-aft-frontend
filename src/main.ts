import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

(window as any).global = window;
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;


// 🎨 Cargar tema antes de bootstrap
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
document.body.classList.add(`theme-${initialTheme}`);


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
