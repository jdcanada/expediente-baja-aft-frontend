import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Dictamen, DictamenDetalle, DictamenListado, DictamenPlano } from '../../models/dictamen';

@Injectable({
  providedIn: 'root'
})
export class DictamenService {
private apiUrl = `${environment.apiUrl}/dictamenes`;
  
    constructor(private http: HttpClient) {}
  
  
    getAll(): Observable<DictamenPlano[]> {
      return this.http.get<DictamenPlano[]>(this.apiUrl);
    }
  
    listAll(): Observable<DictamenListado[]> {
      return this.http.get<DictamenListado[]>(`${this.apiUrl}/list`);
    }
    
    getById(id: number): Observable<DictamenDetalle> {
      return this.http.get<DictamenDetalle>(`${this.apiUrl}/${id}`);
    }
  
  
    getByIdDetalle(id: number): Observable<DictamenDetalle> {
      return this.http.get<DictamenDetalle>(`${this.apiUrl}/${id}/detalle`);
    }
  
   // Crear dictamen y devolver el ID
  create(dictamen: Dictamen): Observable<{ iddictamen: number }> {
    return this.http.post<{ iddictamen: number }>(this.apiUrl, dictamen)
      .pipe(catchError(this.handleError));
  }
  
    update(id: number, dictamen: DictamenListado): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, dictamen);
    }
  
    delete(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
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
  
  
