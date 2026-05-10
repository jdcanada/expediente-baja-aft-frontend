import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { DictamenService } from '../../../services/dictamen/dictamen.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { DictamenFormComponent } from '../dictamen-form/dictamen-form.component';
import { DictamenDetallesDialogComponent } from '../dictamen-detalles-dialog-component/dictamen-detalles-dialog.component';

@Component({
  selector: 'app-dictamen-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './dictamen-list.component.html',
  styleUrls: ['./dictamen-list.component.css']
})
export class DictamenListComponent implements OnInit {
  allData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];  // ✅ Nueva propiedad para datos paginados
  loading = false;
  searchTerm = '';
  currentPage = 0;
  pageSize = 10;

  constructor(
    private dictamenService: DictamenService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDictamenes();
  }

  // ✅ Actualizar los datos paginados
  actualizarPaginatedData(): void {
    const start = this.currentPage * this.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pageSize);
  }

  cargarDictamenes(): void {
    this.loading = true;
    this.cdr.markForCheck(); // ✅ Marca para verificar en el próximo ciclo

    this.dictamenService.listAll().subscribe({
      next: (data) => {
        this.allData = data;
        this.filteredData = [...data];
        this.currentPage = 0;
        this.actualizarPaginatedData();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.notificacionService.mostrarMensaje('Error al cargar dictámenes', true, 'error');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    const searchLower = filterValue.trim().toLowerCase();

    if (!searchLower) {
      this.filteredData = [...this.allData];
    } else {
      this.filteredData = this.allData.filter(item => {
        return (
          item.no_dictamen?.toLowerCase().includes(searchLower) ||
          item.expediente?.numero_expediente?.toLowerCase().includes(searchLower) ||
          item.mediobasico?.aft?.toLowerCase().includes(searchLower) ||
          item.mediobasico?.no_inventario?.toLowerCase().includes(searchLower) ||
          item.mediobasico?.clasificacion?.descripcion?.toLowerCase().includes(searchLower)
        );
      });
    }
    this.currentPage = 0;
    this.actualizarPaginatedData();  // ✅ Actualizar después del filtro
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredData = [...this.allData];
    this.currentPage = 0;
    this.actualizarPaginatedData();  // ✅ Actualizar después de limpiar
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.actualizarPaginatedData();  // ✅ Actualizar después de cambiar página
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.filteredData.length) {
      this.currentPage++;
      this.actualizarPaginatedData();  // ✅ Actualizar después de cambiar página
    }
  }

  abrirFormularioNuevo(): void {
    const dialogRef = this.dialog.open(DictamenFormComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarDictamenes();
    });
  }

  verDetalles(dictamen: any): void {
    this.dictamenService.getById(dictamen.id_dictamen).subscribe({
      next: (detalle) => {
        this.dialog.open(DictamenDetallesDialogComponent, {
          width: '800px',
          maxWidth: '90vw',
          data: detalle
        });
      },
      error: () => {
        this.notificacionService.mostrarMensaje('Error al cargar detalles', true, 'error');
      }
    });
  }

  editarDictamen(dictamen: any): void {
    const dialogRef = this.dialog.open(DictamenFormComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: dictamen
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarDictamenes();
    });
  }

  eliminarDictamen(dictamen: any): void {
    this.notificacionService.confirmarAccion(`¿Eliminar dictamen ${dictamen.no_dictamen}?`).then(confirmado => {
      if (confirmado) {
        this.dictamenService.delete(dictamen.id_dictamen).subscribe({
          next: () => {
            this.cargarDictamenes();
            this.notificacionService.mostrarMensaje('Dictamen eliminado', true, 'success');
          },
          error: () => {
            this.notificacionService.mostrarMensaje('Error al eliminar', true, 'error');
          }
        });
      }
    });
  }
}