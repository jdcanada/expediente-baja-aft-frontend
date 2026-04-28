// tipomovimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoMovimiento, TipoMovimientoConDetalles } from '../../models/tipoMovimiento';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TipoMovimientoService {

private apiUrl = `${environment.apiUrl}/tiposmovimientos`;

  constructor(private http: HttpClient) { }

  // Obtener todos los TipoMovimientos
  getAll(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  //obtener todos los TipoMovimientos 
  listAll(): Observable<TipoMovimientoConDetalles[]> {
    return this.http.get<TipoMovimientoConDetalles[]>(`${this.apiUrl}/list`);
  }

  // Obtener un TipoMovimiento por ID
  getById(id: number): Observable<TipoMovimiento> {
    return this.http.get<TipoMovimiento>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo TipoMovimiento
  create(data: TipoMovimiento): Observable<TipoMovimiento> {
    return this.http.post<TipoMovimiento>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un TipoMovimiento existente
  update(id: number, data: TipoMovimiento): Observable<TipoMovimiento> {
    return this.http.put<TipoMovimiento>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un TipoMovimiento
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o red
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error?.message) {
      // Mensaje personalizado del backend
      errorMessage = error.error.message;
    } else {
      // Otros errores HTTP
      errorMessage = `Código: ${error.status} - Mensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
