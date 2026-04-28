import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MovimientoAFT, MovimientoAFTCompleto } from '../../models/movimientoaft';
import { Mediobasico } from '../../models/medioBasico';

@Injectable({
  providedIn: 'root'
})
export class MovimientoaftService {
  private apiUrl = `${environment.apiUrl}/movimientos`;

  constructor(private http: HttpClient) { }

  // Obtener todas las Expedientees
  getAll(): Observable<MovimientoAFT[]> {
    return this.http.get<MovimientoAFT[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<MovimientoAFTCompleto[]> {
    return this.http.get<MovimientoAFTCompleto[]>(`${this.apiUrl}/list`);
  }

  // Obtener Expediente por ID
  getById(id: number): Observable<MovimientoAFT> {
    return this.http.get<MovimientoAFT>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<MovimientoAFTCompleto> {
    return this.http.get<MovimientoAFTCompleto>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nueva Expediente
  create(data: MovimientoAFT): Observable<{ idmovimiento: number }> {
    return this.http.post<{ idmovimiento: number }>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  createMasivo(data: Mediobasico[]): Observable<{ resultados: any[] }> {
  return this.http.post<any>(`${this.apiUrl}/bulk`, data)
    .pipe(catchError(this.handleError));
}


  // Actualizar Expediente existente
  update(id: number, data: MovimientoAFTCompleto): Observable<MovimientoAFT> {
    return this.http.put<MovimientoAFT>(`${this.apiUrl}/${id}`, data)
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

