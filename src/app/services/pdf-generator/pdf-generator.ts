import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AFTRegistro } from '../../models/aftregistro';
import { ExpedienteFormulario } from '../../models/expedienteformulario';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, AlignmentType, BorderStyle, HeightRule } from "docx";



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }



  generateDictamenesPDF(expediente: ExpedienteFormulario, medios: AFTRegistro[]): Observable<Blob> {
    return new Observable(observer => {
      (async () => {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
          pdfMakeModule.default.addVirtualFileSystem(pdfFontsModule.default);

          const docDefinition = this.buildDocDefinition(expediente, medios);
          const pdfDocGenerator = pdfMakeModule.default.createPdf(docDefinition);

          pdfDocGenerator.getBlob((blob: Blob) => {
            observer.next(blob);
            observer.complete();
          });
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }

  private buildDocDefinition(expediente: ExpedienteFormulario, medios: AFTRegistro[]) {
    const content: any[] = [];

    medios.forEach((medio, i) => {
      content.push(...this.buildDictamenPage(expediente, medio));
      if (i < medios.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    return {
      content,
      defaultStyle: { font: 'Roboto', fontSize: 9 },
      styles: {
        header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 2] },
        subheader: { fontSize: 10, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 9, bold: true, alignment: 'center', margin: [0, 2, 0, 2] },
        normal: { fontSize: 9 }
      }
    };
  }

  private buildSectionTitle(title: string, colSpan: number) {
    // Centra el título de la sección usando tabla y colspan
    const cells = Array(colSpan).fill(null);
    cells[0] = { text: title, style: 'sectionHeader', alignment: 'center', colSpan: colSpan };
    return {
      table: {
        widths: Array(colSpan).fill('*'),
        body: [cells]
      },
      layout: 'grid',
      margin: [0, 1, 0, 1]
    };
  }

  private buildDictamenPage(expediente: ExpedienteFormulario, medio: AFTRegistro) {
    return [
      { text: 'ANEXO IV. Dictamen Técnico', style: 'header' },
      { text: 'DICTAMEN TÉCNICO DE ACTIVOS FIJOS TANGIBLES', style: 'subheader' },
      {
        text: 'Mediante la Resolución Rectoral No: 352 de 2024 el Rector de la Universidad de las Ciencias Informáticas, dispuso designar la comisión encargada de dictaminar el estado técnico de los equipos o Muebles y proceder con las Bajas Técnicas para los Activos Fijos Tangibles que procedan.',
        margin: [0, 0, 0, 2]
      },

      // DATOS DE SOLICITUD
      this.buildSectionTitle('DATOS DE SOLICITUD', 3),
      {
        table: {
          widths: ['40%', '20%', '40%'],
          body: [
            [
              { text: 'Estructura a la que pertenece:', style: 'normal' },
              { text: 'Centro de Costo:', style: 'normal' },
              { text: 'Área de Responsabilidad:', style: 'normal' }
            ],
            [
              { text: `${expediente.estructura || ''}`, style: 'normal' },
              { text: `${expediente.centroCostoCodigo || ''}`, style: 'normal' },
              { text: `${medio.area || ''}`, style: 'normal' }
            ],
            [
              { text: 'Directivo que solicita:', style: 'normal' },
              { text: 'Cargo:', style: 'normal' },
              { text: 'Teléfono:', style: 'normal' }
            ],
            [
              { text: `${expediente.nombreSolicitante || ''}`, style: 'normal' },
              { text: `${expediente.cargoSolicitante || ''}`, style: 'normal' },
              { text: `${expediente.telefono || ''}`, style: 'normal' }
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      },

      // DATOS DEL MEDIO
      this.buildSectionTitle('DATOS DEL MEDIO', 2),
      {
        table: {
          widths: ['30%', '40%', '30%'],
          body: [
            [
              { text: 'Descripción', bold: true },
              { text: medio.aft || '' },
              { text: 'Fecha', bold: true, alignment: 'center' }
            ],
            [
              { text: 'Número de Inventario', bold: true },
              { text: medio.mb || '' },
              {
                table: {
                  widths: ['*', '*', '*'],
                  body: [
                    [
                      { text: 'D', alignment: 'center', margin: [0, 2, 0, 0], border: [false, false, true, false] },
                      { text: 'M', alignment: 'center', margin: [0, 2, 0, 0], border: [true, false, true, false] },
                      { text: 'A', alignment: 'center', margin: [0, 2, 0, 0], border: [true, false, false, false] }
                    ]
                  ]
                },
                layout: 'grid',
                margin: [0, 0, 0, 0]
              }
            ],
            [
              { text: 'No. Dictamen', bold: true },
              { text: medio.noDictamen || '' },
              {
                table: {
                  widths: ['*', '*', '*'],
                  body: [
                    [
                      { text: '', alignment: 'center', margin: [0, 2, 0, 5], border: [false, false, true, false] },
                      { text: '', alignment: 'center', margin: [0, 2, 0, 5], border: [true, false, true, false] },
                      { text: '', alignment: 'center', margin: [0, 2, 0, 5], border: [true, false, false, false] }
                    ]
                  ]
                },
                layout: 'grid',
                margin: [0, 0, 0, 0]
              }
            ],
            [
              { text: 'Características', bold: true },
              {
                colSpan: 2,
                text: [
                  medio.caracteristica.toLocaleLowerCase() === 'metal' ? '[X] Metal       ' : '[ ] Metal      ',
                  medio.caracteristica.toLocaleLowerCase() === 'madera' ? '[X] Madera       ' : '[ ] Madera       ',
                  medio.caracteristica.toLocaleLowerCase() === 'plástico' ? '[X] Plástico       ' : '[ ] Plástico       ',
                  medio.caracteristica.toLocaleLowerCase() === 'vinil' ? '[X] Vinil       ' : '[ ] Vinil      ',
                  medio.caracteristica.toLocaleLowerCase() === 'otros' ? '[X] Otros   ' : '[ ] Otros'
                ].join(''),
                fontSize: 9
              },
              null // Obligatorio para colSpan
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      }

      ,

      // ARGUMENTACIÓN TÉCNICA
      this.buildSectionTitle('ARGUMENTACIÓN TÉCNICA', 1),
      {
        table: {
          widths: ['*'],
          body: [
            [
              { text: 'Dictamen del estado técnico: ' + medio.argumentacion || '', style: 'normal', alignment: 'left', margin: [0, 2, 0, 2] }
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      },

      // DICTAMEN TÉCNICO PARTES Y PIEZAS
      this.buildSectionTitle('DICTAMEN TÉCNICO PARTES Y PIEZAS', 4),
      {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            ['Descripción', 'Modelo', 'No. Serie', 'Defecto Técnico'],
            [
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] }
            ],
            [
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] }
            ],
            [
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] },
              { text: '', margin: [0, 5, 0, 5] }
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      }
      ,

      // CONCLUSIÓN DEL DICTAMEN
      this.buildSectionTitle('CONCLUSIÓN DEL DICTAMEN', 2),
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  !medio.conclusionNoReparable
                    ? '[X] El Activo Fijo Tangible no es reparable y debe ser dado de baja.'
                    : '[ ] El Activo Fijo Tangible no es reparable y debe ser dado de baja.',
                  '\n',
                  !medio.conclusionNoReparable
                    ? '[ ] El Activo Fijo Tangible es reparable y debe ser gestionada su reparación.'
                    : '[X] El Activo Fijo Tangible es reparable y debe ser gestionada su reparación.'
                ].join('')
              }
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 5]
      },

      // DESTINO PROPUESTO
      this.buildSectionTitle('DESTINO PROPUESTO', 2),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                text: medio.destinoFinal?.toLocaleLowerCase() === 'materias primas'
                  ? '[X] Materias primas'
                  : '[ ] Materias primas',
                style: 'normal'
              },
              {
                text: medio.destinoFinal?.toLocaleLowerCase() === 'destruir y botar'
                  ? '[X] Destruir y Botar'
                  : '[ ] Destruir y Botar',
                style: 'normal'
              }
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      },

      // COMISIÓN DE BAJA
      this.buildSectionTitle('COMISIÓN DE BAJA', 2),
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            ['Nombre y Apellido', 'Cargo', 'Firma'],
            [expediente.jefeComision || '','Jefe de la Comisión', '                             '],
            [expediente.miembro1 || '', 'Miembro','                             '],
            [expediente.miembro2 || '', 'Miembro','                             '],
            [expediente.miembro3 || '', 'Miembro','                             ']
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      },

      // DATOS DEL SOLICITANTE
      this.buildSectionTitle('DATOS DEL SOLICITANTE', 2),
      {
        table: {
          widths: ['80%', '20%'],
          body: [
            ['Nombre Apellido', 'Firma'],
            [expediente.nombreSolicitante || '', '                             ']
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 2]
      },

      // DISPOSICIÓN FINAL
      this.buildSectionTitle('DISPOSICIÓN FINAL', 1),
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: 'El AFT debe mantenerse íntegramente en el área actual donde fue dictaminado, hasta el final del proceso.',
                style: 'normal'
              }
            ]
          ]
        },
        layout: 'grid',
        margin: [0, 0, 0, 0]
      }
    ];
  }


  // Método que construye la tabla pdfMake para un solo movimiento AFT (un medio)
  buildMovimientoAFTTable(expediente: ExpedienteFormulario, medio: AFTRegistro, numerosMB?: string): any {

    // Procesar la lista de MBs
    const listadoMBs = (numerosMB || '').split(',').map(x => x.trim()).filter(x => !!x);
    const hayVariosMB = listadoMBs.length > 1;
    const inventarioText = hayVariosMB ? '***VER ABAJO***' : (medio.mb || '');
    return {
      table: {
        widths: ['30%', '20%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: `Entidad: Universidad de las Ciencias Informáticas - UCI`, margin: [2, 2, 2, 2] }, // 1ra columna
            { text: `Código: `, margin: [2, 2, 2, 2] }, // 2da columna
            { text: ``, colSpan: 9, margin: [2, 2, 2, 2], border: [false, true, true, false] }, null, null, null, null, null, null, null, null // 8 null para tapar columnas 4 a 11
          ]
          ,
          [
            { text: `Dirección: ${expediente.centroCostoNombre || ''}`, margin: [2, 2, 2, 2] }, // columna 1 (30%)
            { text: ` ${expediente.centroCostoCodigo || ''}`, margin: [2, 2, 2, 2] }, // columna 2 (15%)
            { text: 'Movimiento de medios básicos', colSpan: 9, bold: true, color: 'red', fontSize: 13, alignment: 'center', margin: [2, 2, 2, 2], border: [false, false, true, false] }, null, null, null, null, null, null, null, null // 8 nulls para tapar las columnas restantes
          ]
          ,
          [
            { text: `Área: ${medio.area || ''}`, colSpan: 2, margin: [2, 2, 2, 2] }, null, // columna 1 (30%)
            { text: ``, colSpan: 9, margin: [2, 2, 2, 2], border: [false, false, true, false] }, // columnas 3 a 11
            null, null, null, null, null, null, null, null // 8 null para tapar columnas 4 a 11
          ]
          ,
          [
            { text: `Descripción: ${medio.aft || ''}`, colSpan: 11, margin: [2, 2, 2, 2] },
            null, null, null, null, null, null, null, null, null, null
          ]
          ,
          [
            { text: 'CNMB', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [false, true, true, true] },
            { text: 'D', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'M', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'A', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'Alquiler:', colSpan: 4, margin: [2, 2, 2, 2] }, null, null, null,
            { text: '$', alignment: 'left', colSpan: 2, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null,
          ],
          [
            { text: `Inventario No: ${inventarioText}`, margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: 'Tiempo:', margin: [2, 2, 2, 2] },
            { text: 'D', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'M', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'A', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: '', colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, false] }, null,
          ],
          [
            { text: 'Sub-Cuenta:', margin: [2, 2, 2, 2] },
            { text: 'Valor:', colSpan: 4, margin: [2, 2, 2, 2] }, null, null, null,
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null,
          ],
          [
            { text: 'Entidad: MATERIA PRIMAS', colSpan: 11, margin: [2, 2, 2, 2] }, null, null, null, null, null, null, null, null, null, null
          ],
          [
            { text: 'Dirección: MATERIA PRIMAS', colSpan: 11, margin: [2, 2, 2, 2] }, null, null, null, null, null, null, null, null, null, null
          ],
          [
            { text: 'Área: MATERIA PRIMAS', colSpan: 2, margin: [2, 2, 2, 2] }, null,
            { text: 'Firma: ', colSpan: 9, margin: [2, 2, 2, 2] }, null, null, null, null, null, null, null, null,
          ],
          [
            { text: '( ) Compra M. B. Nuevo', margin: [2, 2, 2, 2], border: [true, true, false, false] },
            { text: '( ) Traslado interno', margin: [2, 2, 2, 2], border: [false, true, false, false] },
            { text: '( ) Retiro', colSpan: 3, margin: [2, 2, 2, 2], border: [false, true, true, false] }, null, null,
            { text: 'Fundamentación de la Operación:', colSpan: 6, bold: true, alignment: 'center', margin: [2, 2, 2, 2] },
            null, null, null, null, null
          ],
          [
            { text: '( ) Compra M. B. de uso', margin: [2, 2, 2, 2], border: [true, false, false, false] },
            { text: '( ) Traspaso efectuado', margin: [2, 2, 2, 2], border: [false, false, false, false] },
            { text: '( ) Pérdida', colSpan: 3, margin: [2, 2, 2, 2], border: [false, false, true, false] }, null, null,
            { text: '', colSpan: 6, margin: [2, 2, 2, 2], border: [false, true, true, false] },
            null, null, null, null, null
          ],
          [
            { text: '( ) Traspaso recibido', margin: [2, 2, 2, 2], border: [true, false, false, false] },
            { text: '( ) Otros activos', margin: [2, 2, 2, 2], border: [false, false, false, false] },
            { text: '( ) Venta', colSpan: 3, margin: [2, 2, 2, 2], border: [false, false, true, false] }, null, null,
            { text: 'Propuesto a Baja', alignment: 'center', colSpan: 6, margin: [2, 2, 2, 2], border: [true, false, true, false] },
            null, null, null, null, null
          ],
          [
            { text: '( ) Ajuste inv alta', margin: [2, 2, 2, 2], border: [true, false, false, false] },
            { text: '( x ) Ajuste inv. baja', margin: [2, 2, 2, 2], border: [false, false, false, false] },
            { text: '', colSpan: 3, margin: [2, 2, 2, 2], border: [false, false, true, false] }, null, null,
            { text: '', colSpan: 6, margin: [2, 2, 2, 2], border: [true, false, true, false] }, null, null, null, null, null
          ],
          [
            { text: '( ) Enviado a reparar', margin: [2, 2, 2, 2], border: [true, false, false, true] },
            { text: '( ) Activo ocioso', margin: [2, 2, 2, 2], border: [false, false, false, true] },
            { text: '', colSpan: 3, margin: [2, 2, 2, 2], border: [false, false, true, true] }, null, null,
            { text: '', colSpan: 6, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null, null, null, null, null
          ],
          [
            { text: 'INFORME TÉCNICO.', bold: true, alignment: 'center', margin: [2, 2, 2, 2], border: [true, true, false, true] },
            { text: '', colSpan: 4, margin: [2, 2, 2, 2], border: [false, true, false, true] }, null, null, null,
            { text: '', colSpan: 6, margin: [2, 2, 2, 2] }, null, null, null, null, null
          ],
          [
            { text: 'Nombre:', margin: [2, 2, 2, 2], border: [true, true, false, true] },
            { text: '', margin: [2, 2, 2, 2], border: [false, true, true, true] },
            { text: 'Cargo:', colSpan: 4, margin: [2, 2, 2, 2] }, null, null, null,
            { text: 'Firma:', colSpan: 5, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null, null, null, null,
          ],
          [
            { text: `Hecho: ${expediente.nombreSolicitante || ''}`, colSpan: 2, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null,
            { text: 'D', margin: [2, 2, 2, 2] },
            { text: 'M', margin: [2, 2, 2, 2] },
            { text: 'A', margin: [2, 2, 2, 2] },
            { text: `Aprobado: ${expediente.nombreJefeAprueba || ''}`, colSpan: 3, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null, null,
            { text: 'D', margin: [2, 2, 2, 2] },
            { text: 'M', margin: [2, 2, 2, 2] },
            { text: 'A', margin: [2, 2, 2, 2] },
          ],
          [
            { text: `Cargo: ${expediente.cargoSolicitante || ''}`, colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, false] }, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: `Cargo: ${expediente.cargoJefeAprueba || ''}`, colSpan: 3, margin: [2, 2, 2, 2], border: [true, false, true, false] }, null, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
          ],
          [
            { text: 'Firma: ', colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: 'Firma:', colSpan: 3, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },

          ],
          [
            { text: `Autorizado: ${expediente.nombreSolicitante || ''}`, colSpan: 2, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null,
            { text: 'D', margin: [2, 2, 2, 2] },
            { text: 'M', margin: [2, 2, 2, 2] },
            { text: 'A', margin: [2, 2, 2, 2] },
            { text: 'Transportador o Receptor:', colSpan: 3, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null, null,
            { text: 'D', margin: [2, 2, 2, 2] },
            { text: 'M', margin: [2, 2, 2, 2] },
            { text: 'A', margin: [2, 2, 2, 2] },
          ],
          [
            { text: `Cargo: ${expediente.cargoSolicitante || ''}`, colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, false] }, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', colSpan: 3, margin: [2, 2, 2, 2], border: [true, false, true, false] }, null, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
            { text: '', margin: [2, 2, 2, 2], border: [true, true, true, false] },
          ],
          [
            { text: 'Firma: ', colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: 'Firma: ', colSpan: 3, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null, null,
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
            { text: '', margin: [2, 2, 2, 2], border: [true, false, true, true] },
          ],
          [
            { text: '', colSpan: 2, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null,
            { text: '', colSpan: 4, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null, null, null,
            { text: 'D', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'M', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'A', alignment: 'center', margin: [2, 2, 2, 2] },
            { text: 'No: ', colSpan: 2, margin: [2, 2, 2, 2], border: [true, true, true, false] }, null
          ],
          [
            { text: 'Anotando:', colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null,
            { text: 'No: ', colSpan: 4, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null, null, null,
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', margin: [2, 2, 2, 2] },
            { text: '', colSpan: 2, margin: [2, 2, 2, 2], border: [true, false, true, true] }, null,
          ],
          [
            { text: hayVariosMB ? `Listado de MB: ${listadoMBs.join(', ')}` : '', colSpan: 11, border: [true, false, true, true], alignment: 'left' }, null, null, null, null, null, null, null, null, null, null,


          ]
        ]
      },
      layout: 'grid',
      fontSize: 9,
      margin: [0, 0, 0, 0]
    };
  }

  // Método que construye el documento pdfMake con todas las páginas de movimientos AFT
  buildMovimientoDocDefinition(expediente: ExpedienteFormulario, medios: AFTRegistro[]): any {
    const content: any[] = [];

    medios.forEach((medio, i) => {
      content.push(this.buildMovimientoAFTTable(expediente, medio));
      if (i < medios.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    return {
      content,
      // pageOrientation: 'landscape', // Cambiar a horizontal
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20], // Márgenes más pequeños
      defaultStyle: {
        font: 'Roboto',
        fontSize: 8, // Reducir tamaño de fuente
      },
      styles: {
        header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 2] },
        subheader: { fontSize: 10, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 9, bold: true, alignment: 'center', margin: [0, 2, 0, 2] },
        normal: { fontSize: 9 }
      }
    };
  }

  // Ejemplo de método para generar el PDF completo de movimientos
  generarMovimientoPDF(expediente: ExpedienteFormulario, medios: AFTRegistro[]): Observable<Blob> {
    return new Observable(observer => {
      (async () => {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
          pdfMakeModule.default.addVirtualFileSystem(pdfFontsModule.default);

          const docDefinition = this.buildDocDefinitionMovimientosAgrupados(expediente, medios);
          const pdfDocGenerator = pdfMakeModule.default.createPdf(docDefinition);

          pdfDocGenerator.getBlob((blob: Blob) => {
            observer.next(blob);
            observer.complete();
          });
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }

  generateMovimientosAgrupados(expediente: ExpedienteFormulario, medios: AFTRegistro[]): Observable<Blob> {
    return new Observable(observer => {
      (async () => {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
          pdfMakeModule.default.addVirtualFileSystem(pdfFontsModule.default);

          const docDefinition = this.buildDocDefinitionMovimientosAgrupados(expediente, medios);
          const pdfDocGenerator = pdfMakeModule.default.createPdf(docDefinition);

          pdfDocGenerator.getBlob((blob: Blob) => {
            observer.next(blob);
            observer.complete();
          });
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }

  private buildDocDefinitionMovimientosAgrupados(expediente: ExpedienteFormulario, medios: AFTRegistro[]) {
    const content: any[] = [];
    const grupos = this.agruparPorAreaYClasificacion(medios);

    Object.values(grupos).forEach((grupo, i, arr) => {
      const numerosMB = grupo.map(mb => mb.mb).join(', ');
      // Usa solo el primer medio para los datos generales
      content.push(this.buildMovimientoAFTTable(expediente, grupo[0], numerosMB));
      if (i < arr.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    return {
      content,
      defaultStyle: { font: 'Roboto', fontSize: 9 },
      styles: {
        header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 2] },
        subheader: { fontSize: 10, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 9, bold: true, alignment: 'center', margin: [0, 2, 0, 2] },
        normal: { fontSize: 9 }
      }
    };
  }

  validarTabla(body: any[][], expectedCols: number) {
    body.forEach((fila, index) => {
      if (fila.length !== expectedCols) {
        console.error(`Fila ${index} tiene longitud ${fila.length} (esperado ${expectedCols})`, fila);
      }
      fila.forEach((celda, i) => {
        if (celda === undefined) {
          console.error(`Fila ${index} celda ${i} es undefined`, fila);
        }
      });
    });
  }


  generateDictamenesDocx(expediente: ExpedienteFormulario, medios: AFTRegistro[]): Observable<Blob> {
    return new Observable(observer => {
      try {
        const children: (Paragraph | Table)[] = [];
        // Generar contenido para cada medio
        medios.forEach((medio, index) => {
          if (index > 0) {
            children.push(new Paragraph({
              children: [new TextRun({ break: 1 })],
              pageBreakBefore: true
            }));
          }
          // buildDictamenPageDocx ahora devuelve (Paragraph | Table)[]
          children.push(...this.buildDictamenPageDocx(expediente, medio));
        });

        const doc = new Document({
          sections: [{
            properties: {},
            children
          }]
        });

        Packer.toBlob(doc).then(blob => {
          observer.next(blob);
          observer.complete();
        });
      } catch (error) {
        observer.error(error);
      }
    });
  }


  private buildDictamenPageDocx(expediente: ExpedienteFormulario, medio: AFTRegistro): (Paragraph | Table)[] {
    console.log(medio);
    const blocks: (Paragraph | Table)[] = [];

    // Helper para crear filas con altura fija
    const rowHeight = 320; // Puedes ajustar este valor (en twips, 1 pt = 20 twips)
    function createRow(children: TableCell[]): TableRow {
      return new TableRow({
        height: { value: rowHeight, rule: HeightRule.ATLEAST },
        children
      });
    }

    // Encabezado (fuera de tabla)
    blocks.push(new Paragraph({
      children: [new TextRun({ text: "ANEXO IV. Dictamen Técnico", bold: true, size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }));
    blocks.push(new Paragraph({
      children: [new TextRun({ text: "DICTAMEN TÉCNICO DE ACTIVOS FIJOS TANGIBLES", bold: true, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }));
    blocks.push(new Paragraph({
      text: "Mediante la Resolución Rectoral No: 352 de 2024 el Rector de la Universidad de las Ciencias Informáticas, dispuso designar la comisión encargada de dictaminar el estado técnico de los equipos o Muebles y proceder con las Bajas Técnicas para los Activos Fijos Tangibles que procedan.",
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 200 }
    }));

    const rows: TableRow[] = [];

    // DATOS DE SOLICITUD
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "DATOS DE SOLICITUD", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    ]));
    rows.push(createRow([
      this.headerCell("Estructura a la que pertenece:"),
      this.headerCell("Centro de Costo:"),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph({ children: [new TextRun({ text: "Área de Responsabilidad:", bold: true })] })],
        shading: { fill: "EDEDED" }
      })
    ]));
    rows.push(createRow([
      this.valueCell(expediente.estructura || ""),
      this.valueCell(expediente.centroCostoCodigo || ""),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph(medio.area || "")]
      })
    ]));
    rows.push(createRow([
      this.headerCell("Directivo que solicita:"),
      this.headerCell("Cargo:"),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph({ children: [new TextRun({ text: "Teléfono:", bold: true })] })],
        shading: { fill: "EDEDED" }
      })
    ]));
    rows.push(createRow([
      this.valueCell(expediente.nombreSolicitante || ""),
      this.valueCell(expediente.cargoSolicitante || ""),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph(expediente.telefono || "")]
      })
    ]));

    // DATOS DEL MEDIO
    // DATOS DEL MEDIO (título de sección)
    // Título de sección
    rows.push(new TableRow({
      children: [
        new TableCell({
          columnSpan: 4,
          children: [
            new Paragraph({
              children: [new TextRun({ text: "DATOS DEL MEDIO", bold: true })],
              alignment: AlignmentType.CENTER
            })
          ]
        })
      ]
    }));

    // 1ra fila: Descripción | dato | Fecha (colSpan 2)
    rows.push(new TableRow({
      children: [
        this.headerCell("Descripción"),
        this.valueCell(medio.aft || ""),
        new TableCell({
          columnSpan: 2,
          children: [new Paragraph({ children: [new TextRun({ text: "Fecha", bold: true })], alignment: AlignmentType.CENTER })],
          shading: { fill: "EDEDED" }
        })
      ]
    }));

    // 2da fila: Número de inventario | dato | subtabla D | M | A (colSpan 2)
    rows.push(new TableRow({
      children: [
        this.headerCell("Número de Inventario"),
        this.valueCell(medio.mb || ""),
        new TableCell({
          columnSpan: 2,
          children: [
            // Subtabla para D | M | A
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "D" })], alignment: AlignmentType.CENTER })],
                      borders: {
                        top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "M" })], alignment: AlignmentType.CENTER })],
                      borders: {
                        top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "A" })], alignment: AlignmentType.CENTER })],
                      borders: {
                        top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE }
                      }
                    }),
                  ]
                })
              ]
            })
          ]
        })
      ]
    }));

    // 3ra fila: No. Dictamen | dato | subtabla para rayas (colSpan 2)
    rows.push(new TableRow({
      children: [
        this.headerCell("No. Dictamen"),
        this.valueCell(String(medio.noDictamen)),
        new TableCell({
          columnSpan: 2,
          children: [
            // Subtabla para los espacios en blanco con rayas
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "", size: 18 })], alignment: AlignmentType.CENTER })],
                      borders: {
                        top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        right: { size: 0, color: "000000", style: BorderStyle.SINGLE }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "", size: 18 })], alignment: AlignmentType.CENTER })],
                      borders: {
                        top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        left: { size: 0, color: "000000", style: BorderStyle.SINGLE },
                        bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        right: { size: 0, color: "FFFFFF", style: BorderStyle.SINGLE }
                      }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "", size: 18 })], alignment: AlignmentType.CENTER })],
                      borders: {
                        top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        left: { size: 0, color: "000000", style: BorderStyle.SINGLE },
                        bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                        right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE }
                      }
                    }),
                  ]
                })
              ]
            })
          ]
        })
      ]
    }));

    // 4ta fila: Características | datos (colSpan 3)
    rows.push(new TableRow({
      children: [
        this.headerCell("Características"),
        new TableCell({
          columnSpan: 3,
          children: [
            new Paragraph({
              text:
                (medio.caracteristica?.toLocaleLowerCase() === 'metal' ? '[X] Metal ' : '      [ ] Metal ') +
                (medio.caracteristica?.toLocaleLowerCase() === 'madera' ? '[X] Madera ' : '       [ ] Madera ') +
                (medio.caracteristica?.toLocaleLowerCase() === 'plástico' ? '[X] Plástico ' : '       [ ] Plástico ') +
                (medio.caracteristica?.toLocaleLowerCase() === 'vinil' ? '[X] Vinil ' : '       [ ] Vinil ') +
                (medio.caracteristica?.toLocaleLowerCase() === 'otros' ? '[X] Otros' : '        [ ] Otros'),
              alignment: AlignmentType.CENTER // <-- Esto centra el texto horizontalmente
            }),
          ]
        })
      ]
    }));


    // ARGUMENTACIÓN TÉCNICA
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "ARGUMENTACIÓN TÉCNICA", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    ]));
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            text: "Dictamen del estado técnico:   \n" + (medio.argumentacion || ""),
            alignment: AlignmentType.LEFT
          })
        ]
      })
    ]));

    // DICTAMEN TÉCNICO PARTES Y PIEZAS
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "DICTAMEN TÉCNICO PARTES Y PIEZAS", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ],
      })
    ]));
    rows.push(createRow([
      this.headerCell("Descripción"),
      this.headerCell("Modelo"),
      this.headerCell("No. Serie"),
      this.headerCell("Defecto Técnico")
    ]));
    for (let i = 0; i < 3; i++) {
      rows.push(createRow([
        this.valueCell(""),
        this.valueCell(""),
        this.valueCell(""),
        this.valueCell("")
      ]));
    }

    // CONCLUSIÓN DEL DICTAMEN
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: !medio.conclusionNoReparable
                  ? "[X] El Activo Fijo Tangible no es reparable y debe ser dado de baja."
                  : "[ ] El Activo Fijo Tangible no es reparable y debe ser dado de baja."
              })], alignment: AlignmentType.LEFT,
          })
        ],
        borders: {
          top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
          left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
          bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
          right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
        },
      })
    ]));
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: !medio.conclusionNoReparable
                  ? "[ ] El Activo Fijo Tangible es reparable y debe ser gestionada su reparación."
                  : "[X] El Activo Fijo Tangible es reparable y debe ser gestionada su reparación."
              })
            ],
            alignment: AlignmentType.LEFT
          })
        ],
        borders: {
          top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
          left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
          bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
          right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
        },
      })
    ]));

    // DESTINO PROPUESTO
    rows.push(createRow([
      new TableCell({
        columnSpan: 2,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: medio.destinoFinal?.toLocaleLowerCase() === 'materias primas'
                  ? '[X] Materias primas'
                  : '[ ] Materias primas'
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ]
      }),
      new TableCell({
        columnSpan: 2,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: medio.destinoFinal?.toLocaleLowerCase() === 'destruir y botar'
                  ? '[X] Destruir y Botar'
                  : '[ ] Destruir y Botar'
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    ]));

    // COMISIÓN DE BAJA
    rows.push(createRow([
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Nombre(s) y apellidos", bold: true })], alignment: AlignmentType.CENTER })],
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Cargo", bold: true })], alignment: AlignmentType.CENTER })],
      }),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph({ children: [new TextRun({ text: "Firma", bold: true })], alignment: AlignmentType.CENTER })],
      })
    ]));

    rows.push(createRow([
      new TableCell({
        children: [new Paragraph({ text: expediente.jefeComision || "", alignment: AlignmentType.LEFT })]
      }),
      new TableCell({
        children: [new Paragraph({ text: "Jefe de comisión", alignment: AlignmentType.CENTER })]
      }),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph("")]
      })
    ]));

     rows.push(createRow([
      new TableCell({
        children: [new Paragraph({ text: expediente.miembro1 || "", alignment: AlignmentType.LEFT })]
      }),
      new TableCell({
        children: [new Paragraph({ text: "Miembro", alignment: AlignmentType.CENTER })]
      }),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph("")]
      })
    ]));

    rows.push(createRow([
      new TableCell({
        children: [new Paragraph({ text: expediente.miembro2 || "", alignment: AlignmentType.LEFT })]
      }),
      new TableCell({
        children: [new Paragraph({ text: "Miembro", alignment: AlignmentType.CENTER })]
      }),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph("")]
      })
    ]));

    rows.push(createRow([
      new TableCell({
        children: [new Paragraph({ text: expediente.miembro3 || "", alignment: AlignmentType.LEFT })]
      }),
      new TableCell({
        children: [new Paragraph({ text: "Miembro", alignment: AlignmentType.CENTER })]
      }),
      new TableCell({
        columnSpan: 2,
        children: [new Paragraph("")]
      })
    ]));


    // DATOS DEL SOLICITANTE
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "DATOS DEL SOLICITANTE", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    ]));
    rows.push(createRow([
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Nombre(s) y apellidos", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Cargo", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      }),
      new TableCell({
        columnSpan: 2,
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Firma", bold: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      })
    ]));
    rows.push(createRow([
      new TableCell({
        children: [
          new Paragraph({
            text: expediente.nombreSolicitante || "",
            alignment: AlignmentType.CENTER
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: expediente.cargoSolicitante || "",
            alignment: AlignmentType.CENTER
          })
        ]
      }),
      new TableCell({
        columnSpan: 2,
        children: [
          new Paragraph({
            text: "", // Espacio en blanco para firma manual
            alignment: AlignmentType.CENTER
          })
        ]
      })
    ]));

    // DISPOSICIÓN FINAL
    rows.push(createRow([
      new TableCell({
        columnSpan: 4,
        children: [
          new Paragraph("El AFT debe mantenerse íntegramente en el área actual donde fue dictaminado, hasta el final del proceso.")
        ]
      })
    ]));

    blocks.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows
    }));

    return blocks;
  }

  // Helpers
  private headerCell(text: string): TableCell {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
      shading: { fill: "EDEDED" }
    });
  }
  private valueCell(text: string): TableCell {
    return new TableCell({
      children: [new Paragraph(text)]
    });
  }


  private sectionTitleRow(title: string, colSpan: number = 4): TableRow {
    return new TableRow({
      children: [
        new TableCell({
          columnSpan: colSpan,
          children: [
            new Paragraph({
              children: [new TextRun({ text: title, bold: true })],
              alignment: AlignmentType.CENTER
            })
          ]
        }),
        ...Array(4 - colSpan).fill(new TableCell({ children: [] }))
      ].slice(0, 4)
    });
  }




  private createSectionTitle(text: string): Paragraph {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      thematicBreak: true,
      spacing: { before: 300, after: 200 }
    });
  }

  private createSimpleTable(rows: [string, string][]): Table {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: rows.map(([key, value]) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: key, bold: true })
                  ]
                })
              ],
              shading: { fill: "D3D3D3" },
              width: { size: 40, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph(value)],
              width: { size: 60, type: WidthType.PERCENTAGE }
            })
          ]
        })
      )
    });
  }


  generarMovimientosDocx(expediente: ExpedienteFormulario, medios: AFTRegistro[]): Observable<Blob> {
    return new Observable(observer => {
      (async () => {
        try {
          const doc = this.buildMovimientosDocx(expediente, medios);
          const blob = await Packer.toBlob(doc);
          observer.next(blob);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }

  private buildMovimientosDocx(expediente: ExpedienteFormulario, medios: AFTRegistro[]): Document {
    const children = [];

    children.push(new Paragraph({
      text: "Movimiento de Activos Fijos Tangibles",
      heading: HeadingLevel.HEADING_1,
      alignment: "center"
    }));

    // Datos generales
    children.push(this.createSectionTitle("Datos Generales"));
    children.push(this.createSimpleTable([
      ["Centro de Costo", expediente.centroCostoCodigo || ""],
      ["Nombre Centro de Costo", expediente.centroCostoNombre || ""],
      ["Solicitante", expediente.nombreSolicitante || ""]
    ]));

    // Tabla con movimientos
    medios.forEach((medio, i) => {
      children.push(new Paragraph({ text: `\nMovimiento #${i + 1}`, heading: HeadingLevel.HEADING_3 }));
      children.push(this.createSimpleTable([
        ["Descripción", medio.aft || ""],
        ["Área", medio.area || ""],
        ["Número de Inventario", medio.mb || ""],
        ["Clasificación", medio.clasificacion || ""],
        ["Fecha", (medio.fechaDia + "/" + medio.fechaMes + "/" + medio.fechaAno) || ""]
      ]));
      children.push(new Paragraph({ text: "", spacing: { after: 300 } }));
    });

    return new Document({
      sections: [{ children }]
    });
  }


  // Por ejemplo, para una tabla de n columnas (especificar por parametro):
  private getColumnWidths(cols: number): number[] {
    switch (cols) {
      case 2:
        return [3500, 6500]; // Ejemplo: 2 columnas (ajusta a tu gusto)
      case 3:
        return [3000, 3000, 4000]; // Ejemplo: 3 columnas
      case 4:
        return [2500, 2500, 2500, 2500];
      case 11:
        // Ejemplo: tabla de movimientos, puedes ajustar estos valores
        return [2500, 3000, 500, 500, 500, 500, 500, 500, 500, 500, 500];
      default:
        // Por defecto, columnas iguales
        return Array(cols).fill(10000 / cols);
    }
  }


  // Ejemplo de tabla para un solo movimiento
  buildMovimientoAFTTableDocx(
    expediente: ExpedienteFormulario,
    medio: AFTRegistro,
    numerosMB?: string
  ): Table {
    const listadoMBs = (numerosMB || '').split(',').map(x => x.trim()).filter(x => !!x);
    const hayVariosMB = listadoMBs.length > 1;
    const inventarioText = hayVariosMB ? '*VER ABAJO*' : (medio.mb || '');

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [2500, 3000, 500, 500, 500, 500, 500, 500, 500, 500, 500],
      rows: [
        // Fila 1
        new TableRow({
          children: [
            this.cell('Entidad: Universidad de las \n Ciencias Informáticas - UCI'),
            this.cell('Código:', 4),
            this.cell('', 6, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),

          ]
        }),
        // Fila 2
        new TableRow({
          children: [
            this.cell(`Dirección: ${expediente.centroCostoNombre || ''}`),
            this.cell(`${expediente.centroCostoCodigo || ''}`, 4),
            this.cell('Movimiento de medios básicos ', 6, {
              bold: true, color: 'FF0000', alignment: AlignmentType.CENTER, fontSize: 26, borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 3
        new TableRow({
          children: [
            this.cell(`Área: ${medio.area || ''}`, 5),
            this.cell('', 6, {
              borders: {
                left: { size: 0, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 0, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 0, color: "000000", style: BorderStyle.SINGLE },
              }
            })

          ]
        }),
        // Fila 4
        new TableRow({
          children: [
            this.cell(`Descripción: ${medio.aft || ''}`, 11),
          ]
        }),
        // Fila 5
        new TableRow({
          children: [
            this.cell('CNMB', 1),
            this.cell('D ', 1, { alignment: AlignmentType.CENTER }),
            this.cell('M ', 1, { alignment: AlignmentType.CENTER }),
            this.cell('A ', 1, { alignment: AlignmentType.CENTER }),
            this.cell('Alquiler:', 5),
            this.cell('$', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 6
        new TableRow({
          children: [
            this.cell(`Inventario No: ${inventarioText}`, 1),
            this.cell(''),
            this.cell(''),
            this.cell(''),
            this.cell('Tiempo:', 2),
            this.cell('D ', 1, { alignment: AlignmentType.CENTER }),
            this.cell('M ', 1, { alignment: AlignmentType.CENTER }),
            this.cell('A ', 1, { alignment: AlignmentType.CENTER }),
            this.cell('', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 7
        new TableRow({
          children: [
            this.cell('Sub-Cuenta:'),
            this.cell('Valor:', 5),
            this.cell(''),
            this.cell(''),
            this.cell(''),
            this.cell('', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
          ]
        }),
        // Fila 8
        new TableRow({
          children: [
            this.cell('Entidad: MATERIA PRIMAS', 11),
          ]
        }),
        // Fila 9
        new TableRow({
          children: [
            this.cell('Dirección: MATERIA PRIMAS', 11),
          ]
        }),
        // Fila 10
        new TableRow({
          children: [
            this.cell('Área: MATERIA PRIMAS', 1),
            this.cell('Firma: ', 10),
          ]
        }),
        // Fila 11
        new TableRow({
          children: [
            this.cell('( )Compra M. B. Nuevo ( )Traslado interno', 3, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('Fundamentación de la Operación:', 8, { alignment: AlignmentType.CENTER, bold: true }),
          ]
        }),
        // Fila 12
        new TableRow({
          children: [
            this.cell('( )Compra M. B. de uso ( )Traspaso efectuado  ', 3, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 8, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 13
        new TableRow({
          children: [
            this.cell('( )Traspaso recibido          ( )Pérdida     ( )Retiro \n( )Otros activos                  ( )Venta', 3, {

              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('Propuesto a Baja', 8, {
              alignment: AlignmentType.CENTER,
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }, fontSize: 24,
            }),
          ]
        }),
        // Fila 14
        new TableRow({
          children: [
            this.cell('( )Ajuste inv alta                (X)Ajuste inv. baja', 3, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 8, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 15
        new TableRow({
          children: [
            this.cell('( )Enviado a reparar           ( )Activo ocioso', 3, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('', 8, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
          ]
        }),
        // Fila 16
        new TableRow({
          children: [
            this.cell('INFORME TÉCNICO.', 11, { bold: true, alignment: AlignmentType.LEFT }),
          ]
        }),
        // Fila 17
        new TableRow({
          children: [
            this.cell('Nombre:', 4),
            this.cell('Cargo:', 4),
            this.cell('Firma:', 3),
          ]
        }),
        // Fila 18
        new TableRow({
          children: [
            this.cell(`Hecho: ${expediente.nombreSolicitante || ''}`, 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('D  '),
            this.cell('M  '),
            this.cell('A  '),
            this.cell(`Aprobado: ${expediente.nombreJefeAprueba || ''}`, 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('D  '),
            this.cell('M  '),
            this.cell('A  '),
          ]
        }),
        // Fila 19
        new TableRow({
          children: [
            this.cell(`Cargo: ${expediente.cargoSolicitante || ''}`, 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell(`Cargo: ${expediente.cargoJefeAprueba || ''}`, 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 20
        new TableRow({
          children: [
            this.cell('Firma: ', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('____', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('____', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('____', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('Firma:____________________', 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
          ]
        }),
        // Fila 21
        new TableRow({
          children: [
            this.cell(`Autorizado: ${expediente.nombreSolicitante || ''}`, 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('D'),
            this.cell('M'),
            this.cell('A'),
            this.cell('Transportador o Receptor:', 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('D'),
            this.cell('M'),
            this.cell('A'),
          ]
        }),
        // Fila 22
        new TableRow({
          children: [
            this.cell(`Cargo: ${expediente.cargoSolicitante || ''}`, 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 23
        new TableRow({
          children: [
            this.cell('Firma:', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('____', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('____', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('____', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('Firma: ____________________', 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }), this.cell('', 1, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
          ]
        }),
        // Fila 24
        new TableRow({
          children: [
            this.cell('', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('', 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
            this.cell('D  '),
            this.cell('M  '),
            this.cell('A  '),
            this.cell('No: ', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
              }
            }),
          ]
        }),
        // Fila 25
        new TableRow({
          children: [
            this.cell('Anotando:', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell('No: ', 4, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            }),
            this.cell(''),
            this.cell(''),
            this.cell(''),
            this.cell('', 2, {
              borders: {
                left: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                top: { size: 1, color: "FFFFFF", style: BorderStyle.NONE },
                right: { size: 1, color: "000000", style: BorderStyle.SINGLE },
                bottom: { size: 1, color: "000000", style: BorderStyle.SINGLE },
              }
            })
          ]
        }),
        // Fila 26 (si hay varios MBs)
        ...(hayVariosMB ? [
          new TableRow({
            children: [
              this.cell(`Listado de MB: ${listadoMBs.join(', ')}`, 11),
            ]
          })
        ] : [])
      ]
    });
  }


  private agruparPorAreaYClasificacion = (medios: AFTRegistro[]): { [key: string]: AFTRegistro[] } => {
    const grupos: { [key: string]: AFTRegistro[] } = {};
    medios.forEach(medio => {
      const key = `${medio.area}||${medio.clasificacion}`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(medio);
    });
    return grupos;
  }

  // Helper para crear celdas con colSpan y estilos
  private cell(text: string, colSpan: number = 1, opts: { bold?: boolean; color?: string; alignment?: typeof AlignmentType[keyof typeof AlignmentType]; fontSize?: number; borders?: any; } = {}) {
    // Si quieres soportar saltos de línea en el texto:
    const lines = text.split('\n');
    const children: TextRun[] = [];
    lines.forEach((line, idx) => {
      children.push(new TextRun({
        text: line,
        bold: opts.bold,
        color: opts.color,
        size: opts.fontSize
      }));
      // Agrega salto de línea después de cada línea, menos la última
      if (idx < lines.length - 1) {
        children.push(new TextRun({ break: 1 }));
      }
    });

    return new TableCell({
      columnSpan: colSpan,
      children: [
        new Paragraph({
          children,
          alignment: opts.alignment || AlignmentType.LEFT,
        }),
      ],
      borders: opts.borders,
    });
  }


  // Generar y descargar DOCX (llama a esto desde tu componente)
  public async generarYDescargarMovimientosDocx(
    expediente: ExpedienteFormulario,
    medios: AFTRegistro[]
  ): Promise<void> {
    const blob = await this.generateMovimientosDocx(expediente, medios);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movimientos.docx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Generar el documento DOCX completo de movimientos
  public async generateMovimientosDocx(
    expediente: ExpedienteFormulario,
    medios: AFTRegistro[]
  ): Promise<Blob> {
    const docBlocks: (Paragraph | Table)[] = [];
    const grupos = this.agruparPorAreaYClasificacion(medios);
    const grupoKeys = Object.keys(grupos);

    grupoKeys.forEach((key, idx) => {
      const grupo = grupos[key];
      const numerosMB = grupo.map(mb => mb.mb).join(', ');
      docBlocks.push(this.buildMovimientoAFTTableDocx(expediente, grupo[0], numerosMB));
      if (idx < grupoKeys.length - 1) {
        docBlocks.push(new Paragraph({ children: [], pageBreakBefore: true }));
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docBlocks
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }


}
