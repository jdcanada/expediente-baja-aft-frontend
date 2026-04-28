import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InformeResumen, InformeResumenCompleto, InformeResumenPlano } from '../../models/informeResumen';

@Injectable({
  providedIn: 'root'
})
export class InformeresumenService {
  private apiUrl = `${environment.apiUrl}/informesresumen`;

  constructor(private http: HttpClient) { }

  // Obtener todas las Expedientees
  getAll(): Observable<InformeResumenPlano[]> {
    return this.http.get<InformeResumenPlano[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<InformeResumenCompleto[]> {
    return this.http.get<InformeResumenCompleto[]>(`${this.apiUrl}/list`);
  }

  // Obtener Expediente por ID
  getById(id: number): Observable<InformeResumen> {
    return this.http.get<InformeResumen>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<InformeResumenCompleto> {
    return this.http.get<InformeResumenCompleto>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nueva Expediente
  create(data: InformeResumen): Observable<{ idinforme: number }> {
    return this.http.post<{ idinforme: number }>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }


  // Actualizar Expediente existente
  update(id: number, data: InformeResumen): Observable<InformeResumen> {
    return this.http.put<InformeResumen>(`${this.apiUrl}/${id}`, data)
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
