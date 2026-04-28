import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { Area, AreaDetalle, AreaDetalleSimple, AreaPlano } from '../../models/area';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private apiUrl = `${environment.apiUrl}/areas`;

  constructor(private http: HttpClient) { }

   getAllSimple(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl)
     .pipe(catchError(this.handleError));
  }

  // Obtener todas las áreas con paginado
  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener todas las áreas con detalles sin paginado
  listAll(): Observable<AreaDetalleSimple[]> {
    return this.http.get<AreaDetalleSimple[]>(`${this.apiUrl}/list`)
      .pipe(catchError(this.handleError));
  }

  // Obtener área por ID
  getById(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener área por ID con detalles
  getByIdDetalle(id: number): Observable<AreaDetalle> {
    return this.http.get<AreaDetalle>(`${this.apiUrl}/${id}/detalle`)
      .pipe(catchError(this.handleError));
  }

  // Crear nueva área
  create(data: Area): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  
  //crear areas masivo
  createMasivo(data: Area[]): Observable<Area> {
    return this.http.post<Area>(`${this.apiUrl}/bulk`, data)
      .pipe(catchError(this.handleError));
  }


  // Actualizar área existente
  update(id: number, data: Area): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar área
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
