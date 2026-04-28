import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Para el campo es_directivo
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Cargo, EditableCellCargo } from '../../../models/cargo';
import { CargoService } from '../../../services/cargo/cargo.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { CargoForm } from '../cargo-form/cargo-form.component'; // Necesitarás crear este componente
import { RouterModule } from '@angular/router';



@Component({
  standalone: true,
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatSlideToggleModule // Importar para el slide toggle
  ]
})
export class CargoList implements OnInit, AfterViewInit {
  cargos: Cargo[] = [];
  displayedColumns: string[] = ['nombre_cargo', 'es_directivo', 'acciones'];
  dataSource = new MatTableDataSource<Cargo>([]);
  loading = false;
  searchTerm = '';
  pageSize = 5;

  editingCell: EditableCellCargo | null = null;
  tempValue: string | boolean = ''; // Puede ser string o boolean

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cargoService: CargoService,
    private dialog: MatDialog,
    private notificacionService: NotificacionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarCargos();
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.pageSize;
    this.cdr.detectChanges();

  }

  cargarCargos(): void {
    this.loading = true;
    this.cargoService.listAll().subscribe({
      next: (data: Cargo[]) => {
        this.cargos = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificacionService.mostrarMensaje(
          'Error al cargar los cargos',
          true,
          'error'
        );
      }
    });
  }

  searchShow = false;
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.dataSource.filteredData.length === 0) {
      this.searchShow = true;
      this.searchTerm = filterValue;
    } else {
      this.searchShow = false;
      //this.searchTerm = "No hay grupos que coincidan con tu búsqueda ", filterValue;
    }

  }

  startEdit(cargo: Cargo, field: keyof Cargo): void {
    if (field === 'idcargo') return; // No editar ID

    this.editingCell = {
      id: cargo.idcargo,
      field: field,
      value: cargo[field]
    };
    this.tempValue = cargo[field];
  }

  saveEdit(): void {
    if (!this.editingCell) return;

    const updated = this.cargos.find(c => c.idcargo === this.editingCell!.id);
    if (!updated) return;

    const updateData = {
      ...updated,
      [this.editingCell.field]: this.tempValue
    };

    this.cargoService.update(this.editingCell.id, updateData).subscribe({
      next: () => {
        const index = this.cargos.findIndex(c => c.idcargo === this.editingCell!.id);
        if (index !== -1) {
          this.cargos[index] = { ...this.cargos[index], [this.editingCell!.field]: this.tempValue };
          this.dataSource.data = [...this.cargos];
        }
        this.cancelEdit();
        this.notificacionService.mostrarMensaje(
          'Cargo actualizado correctamente',
          true,
          'success'
        );
      },
      error: () => {
        this.notificacionService.mostrarMensaje(
          'Error al actualizar el cargo',
          true,
          'error'
        );
        this.cancelEdit();
      }
    });
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.tempValue = '';
  }

  isEditing(cargo: Cargo, field: keyof Cargo): boolean {
    return this.editingCell?.id === cargo.idcargo && this.editingCell?.field === field;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  abrirFormularioNuevoCargo(): void {
    const dialogRef = this.dialog.open(CargoForm, {
      width: '600px',
      data: null,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCargos();
      }
    });
  }

  editarCargo(cargo: Cargo): void {
    const dialogRef = this.dialog.open(CargoForm, {
      width: '600px',
      data: cargo,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarCargos();
      }
    });
  }

  eliminarCargo(cargo: Cargo): void {
    this.notificacionService.confirmarAccion(
      `¿Está seguro de eliminar el cargo "${cargo.nombre_cargo}"?`
    ).then(confirmado => {
      if (confirmado) {
        this.cargoService.delete(cargo.idcargo).subscribe({
          next: () => {
            this.cargarCargos();
            this.notificacionService.mostrarMensaje(
              'Cargo eliminado correctamente',
              true,
              'success'
            );
          },
          error: () => {
            this.notificacionService.mostrarMensaje(
              'Error al eliminar el cargo',
              true,
              'error'
            );
          }
        });
      }
    });
  }

  getColumnDisplayName(column: string): string {
    const columnNames: { [key: string]: string } = {
      'nombre_cargo': 'Nombre del Cargo',
      'es_directivo': 'Es Directivo',
      'acciones': 'Acciones'
    };
    return columnNames[column] || column;
  }
}
