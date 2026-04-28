import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expediente, ExpedienteDetalle_3, ExpedienteDetalle_4, ExpedientePlano } from '../../models/expediente';
import { ExpedienteFormulario, ExpedienteFormulario2 } from '../../models/expedienteformulario';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  private apiUrl = `${environment.apiUrl}/expedientes`;

  constructor(private http: HttpClient) { }

  // Obtener todas las Expedientees
  getAll(): Observable<ExpedientePlano[]> {
    return this.http.get<ExpedientePlano[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<ExpedienteDetalle_4[]> {
    return this.http.get<ExpedienteDetalle_4[]>(`${this.apiUrl}/list`);
  }

  // Obtener Expediente por ID
  getById(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<ExpedienteDetalle_3> {
    return this.http.get<ExpedienteDetalle_3>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nueva Expediente
  create(data: Expediente): Observable<{ idexpediente: number }> {
    return this.http.post<{ idexpediente: number }>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }


  // Actualizar Expediente existente
  update(id: number, data: ExpedienteDetalle_4): Observable<Expediente> {
    return this.http.put<Expediente>(`${this.apiUrl}/${id}`, data)
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
