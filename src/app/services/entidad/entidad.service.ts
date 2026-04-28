import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Entidad, EntidadDetalleCompleto } from '../../models/entidad';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadService {
  private apiUrl = `${environment.apiUrl}/entidades`;

  constructor(private http: HttpClient) { }

  // Obtener todas las entidades
  getAll(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<EntidadDetalleCompleto[]> {
    return this.http.get<EntidadDetalleCompleto[]>(`${this.apiUrl}/list`);
  }

  // Obtener entidad por ID
  getById(id: number): Observable<Entidad> {
    return this.http.get<Entidad>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<EntidadDetalleCompleto> {
    return this.http.get<EntidadDetalleCompleto>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nueva entidad
  create(data: Entidad): Observable<Entidad> {
    return this.http.post<Entidad>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar entidad existente
  update(id: number, data: Entidad): Observable<Entidad> {
    return this.http.put<Entidad>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar entidad
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
