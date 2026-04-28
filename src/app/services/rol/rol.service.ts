// rol.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Rol, RolConUsuarios } from '../../models/rol';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  // Obtener todos los roles
  getAll(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  //obtener todos los roles y los usuarios con ese rol
  listAll(): Observable<RolConUsuarios[]> {
    return this.http.get<RolConUsuarios[]>(`${this.apiUrl}/list`);
  }

  // Obtener un rol por ID
  getById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo rol
  create(data: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un rol existente
  update(id: number, data: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un rol
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
