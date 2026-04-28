import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DictamenListado } from '../../../models/dictamen';

@Component({
  selector: 'app-dictamen-detalles-dialog',
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './dictamen-detalles-dialog-component.html',
  styleUrl: './dictamen-detalles-dialog-component.css'
})
export class DictamenDetallesDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public dictamen: DictamenListado) { }
}
