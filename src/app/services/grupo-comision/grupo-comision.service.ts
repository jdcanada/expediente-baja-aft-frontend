import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GrupoComision, GrupoComision_Simple, GrupoComisionDetalle } from '../../models/grupoComision';

@Injectable({
  providedIn: 'root'
})
export class GrupoComisionService {
private apiUrl = `${environment.apiUrl}/grupos`;

  constructor(private http: HttpClient) {}

  // Obtener todas las Expedientees
  getAll(): Observable<GrupoComision_Simple[]> {
    return this.http.get<GrupoComision_Simple[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  
   listAll(): Observable<GrupoComisionDetalle[]> {
      return this.http.get<GrupoComisionDetalle[]>(`${this.apiUrl}/list`);
    }

  // Obtener Expediente por ID
  getById(id: number): Observable<GrupoComision_Simple> {
    return this.http.get<GrupoComision_Simple>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<GrupoComisionDetalle> {
        return this.http.get<GrupoComisionDetalle>(`${this.apiUrl}/${id}/detalle`);
      }

  // Crear nueva Expediente
  create(data: GrupoComision): Observable<GrupoComision> {
    return this.http.post<GrupoComision>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar Expediente existente
  update(id: number, data: GrupoComision): Observable<GrupoComision> {
    return this.http.put<GrupoComision>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar Expediente
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
