import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Estructura, Estructura_Areas_Personas, EstructuraDetalle_Dic_Mov_Inf } from '../../models/estructura';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstructuraService {
  private apiUrl = `${environment.apiUrl}/estructuras`;

  constructor(private http: HttpClient) { }

  // Obtener todas las Estructuras enriquecido en forma de objeto
  getAll(): Observable<EstructuraDetalle_Dic_Mov_Inf[]> {
    return this.http.get<EstructuraDetalle_Dic_Mov_Inf[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener todas las Estructuras Simple
  getAllSimple(): Observable<Estructura[]> {
    return this.http.get<Estructura[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<Estructura_Areas_Personas[]> {
    return this.http.get<Estructura_Areas_Personas[]>(`${this.apiUrl}/list`);
  }

  // Obtener Estructura por ID
  getById(id: number): Observable<EstructuraDetalle_Dic_Mov_Inf> {
    return this.http.get<EstructuraDetalle_Dic_Mov_Inf>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<Estructura_Areas_Personas> {
    return this.http.get<Estructura_Areas_Personas>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nueva Estructura
  create(data: Estructura): Observable<Estructura> {
    return this.http.post<Estructura>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar Estructura existente
  update(id: number, data: Estructura_Areas_Personas): Observable<Estructura> {
    return this.http.put<Estructura>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar Estructura
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
