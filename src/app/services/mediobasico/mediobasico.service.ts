import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Mediobasico, MediobasicoListItem, MedioBasicoPlano, MedioBasicoDictamenMasivo } from '../../models/medioBasico';
import { MedioBasicoListadoEnriquecido } from '../../models/movimientoaft';

@Injectable({
  providedIn: 'root'
})
export class MediobasicoService {
  private apiUrl = `${environment.apiUrl}/mediosbasicos`;

  constructor(private http: HttpClient) { }

  // Obtener todas las Expedientees
  getAll(): Observable<MedioBasicoPlano[]> {
    return this.http.get<MedioBasicoPlano[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<MediobasicoListItem[]> {
    return this.http.get<MediobasicoListItem[]>(`${this.apiUrl}/list`);
  }

  // Obtener Expediente por ID
  getById(id: number): Observable<Mediobasico> {
    return this.http.get<Mediobasico>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nuevo medio basico
  create(data: Mediobasico): Observable<{ idmediobasico: number }> {
    return this.http.post<{ idmediobasico: number }>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Crear varios medios básicos (masivo) y devolver los resultados (IDs, status, etc.)
  createMasivo(data: MedioBasicoDictamenMasivo[]): Observable<{ resultados: any[] }> {
    
    return this.http.post<{ resultados: any[] }>(`${this.apiUrl}/bulk`, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar Expediente existente
  update(id: number, data: MediobasicoListItem): Observable<Mediobasico> {
    return this.http.put<Mediobasico>(`${this.apiUrl}/${id}`, data)
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
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código: ${error.status} - Mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

