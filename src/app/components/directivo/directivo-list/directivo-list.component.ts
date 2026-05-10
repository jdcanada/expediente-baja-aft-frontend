import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DirectivoService } from '../../../services/directivo/directivo.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DirectivoForm } from '../directivo-form/directivo-form.component';

@Component({
  selector: 'app-directivo-list',
  templateUrl: './directivo-list.component.html',
  styleUrls: ['./directivo-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ]
})
export class DirectivoList implements OnInit, AfterViewInit {
  directivos: any[] = [];
  displayedColumns: string[] = [
    'nombre',
    'apellidos',
    'solapin',
    'correo',
    'cargo',
    'telefono_corporativo',
    'acciones'
  ];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;
  searchShow = false;

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    // Este setter se ejecuta cuando el paginator está disponible
    if (paginator && this.dataSource) {
      this.dataSource.paginator = paginator;
      paginator.pageSize = this.pageSize;
      this.cdr.detectChanges();
    }
  }

  constructor(
    private directivoService: DirectivoService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDirectivos();
  }

  ngAfterViewInit(): void {
    // No hacemos nada aquí porque el paginator se configura en el setter
  }

  cargarDirectivos(): void {
    this.loading = true;
    this.directivoService.listAll().subscribe({
      next: (data: any[]) => {
        this.directivos = data;
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar los directivos',
          true,
          'error'
        );
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    this.searchShow = this.dataSource.filteredData.length === 0 && filterValue.trim().length > 0;
  }

  eliminarDirectivo(directivo: any): void {
    const nombre = directivo.nombre || directivo.persona?.nombre || 'este directivo';
    const apellidos = directivo.apellidos || directivo.persona?.apellidos || '';
    
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el directivo "${nombre} ${apellidos}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.directivoService.delete(directivo.id_directivo || directivo.iddirectivo).subscribe({
          next: () => {
            this.cargarDirectivos();
            this.notificacionService.mostrarMensaje(
              'Directivo eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el directivo',
              true,
              'error'
            );
          }
        });
      }
    });
  }

  editarDirectivo(directivo: any): void {
    const dialogRef = this.dialog.open(DirectivoForm, {
      width: '650px',
      maxWidth: '90vw',
      data: directivo,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDirectivos();
      }
    });
  }

  getColumnDisplayName(column: string): string {
    const columnNames: { [key: string]: string } = {
      'nombre': 'Nombre',
      'apellidos': 'Apellidos',
      'solapin': 'Solapín',
      'correo': 'Correo Electrónico',
      'cargo': 'Cargo',
      'telefono_corporativo': 'Teléfono Corporativo',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }

  abrirFormularioNuevoDirectivo(): void {
    const dialogRef = this.dialog.open(DirectivoForm, {
      width: '650px',
      maxWidth: '90vw',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarDirectivos();
      }
    });
  }
}