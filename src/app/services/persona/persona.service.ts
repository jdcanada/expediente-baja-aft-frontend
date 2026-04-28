import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Persona, PersonaById, PersonaDetalle, PersonaListItem, PersonaListItem2, PersonaPlano } from '../../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = `${environment.apiUrl}/personas`;

  constructor(private http: HttpClient) { }

  // Obtener todas las Personaes
  getAll(): Observable<PersonaPlano[]> {
    return this.http.get<PersonaPlano[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<PersonaListItem[]> {
    return this.http.get<PersonaListItem[]>(`${this.apiUrl}/list`);
  }

  // Obtener Persona por ID
  getById(id: number): Observable<PersonaById> {
    return this.http.get<PersonaById>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<PersonaDetalle> {
    return this.http.get<PersonaDetalle>(`${this.apiUrl}/${id}/detalle`);
  }

  getDirectivos(): Observable<PersonaListItem2[]>{

     return this.http.get<PersonaListItem2[]>(`${this.apiUrl}/list-directivos`);
  }

  // Crear nueva Persona
  create(data: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  // Actualizar Persona existente
  update(id: number, data: PersonaListItem): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar Persona
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

