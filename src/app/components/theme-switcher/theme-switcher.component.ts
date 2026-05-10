import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/themes/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css']
})
export class ThemeSwitcherComponent {
  constructor(private themeService: ThemeService) {}

  get iconName(): string {
    return this.themeService.getCurrentTheme() === 'dark' ? 'light_mode' : 'dark_mode';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}