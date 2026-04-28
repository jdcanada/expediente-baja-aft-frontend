import { Component, Input } from '@angular/core';
import { DictamenTecnico } from '../../models/dictamentecnico';
import { CommonModule } from '@angular/common';


import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator';

pdfMake.vfs = pdfFonts.vfs;



@Component({
  standalone: true,
  selector: 'app-dictamen-tecnico',
  templateUrl: './dictamen-tecnico.component.html',
  styleUrls: ['./dictamen-tecnico.component.css'],
  imports: [
    CommonModule,
  ]
})
export class DictamenTecnicoComponent {

  @Input() datosDictamen: any; // Recibe datos ya cargados desde padre o servicio

  constructor(private pdfService: PdfGeneratorService) { }

  // generarPdf() {
  //   if (!this.datosDictamen) {
  //     alert('No hay datos para generar el dictamen.');
  //     return;
  //   }

  //   this.pdfService.generateDictamenesPDF(this.datosDictamen.expediente, this.datosDictamen.dictamenes)
  //     .subscribe((blob: Blob) => {
  //       const url = URL.createObjectURL(blob);
  //       window.open(url);
  //     },
  //       (err: any) => {
  //         console.error('Error generando PDF:', err);
  //       })
  //     ;
  // }
}