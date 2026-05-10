import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DictamenDetalle_new } from '../../../models/dictamen';

@Component({
  selector: 'app-dictamen-detalles-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dictamen-detalles-dialog.component.html',
  styleUrls: ['./dictamen-detalles-dialog.component.css']
})
export class DictamenDetallesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dictamen: DictamenDetalle_new) { 
  }

}