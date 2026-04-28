// clasificacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Clasificacion, ClasificacionDetalle } from '../../models/clasificacion';

@Injectable({ providedIn: 'root' })
export class ClasificacionService {
  private apiUrl = `${environment.apiUrl}/clasificacion`;
  
    constructor(private http: HttpClient) {}
  
  
    getAll(): Observable<Clasificacion[]> {
      return this.http.get<Clasificacion[]>(this.apiUrl);
    }
  
    listAll(): Observable<Clasificacion[]> {
      return this.http.get<Clasificacion[]>(`${this.apiUrl}/list`);
    }
    
    getById(id: number): Observable<Clasificacion> {
      return this.http.get<Clasificacion>(`${this.apiUrl}/${id}`);
    }
  
  
    getByIdDetalle(id: number): Observable<ClasificacionDetalle> {
      return this.http.get<ClasificacionDetalle>(`${this.apiUrl}/${id}/detalle`);
    }
  
    create(Clasificacion: Clasificacion): Observable<any> {
      return this.http.post(this.apiUrl, Clasificacion);
    }
  
    update(id: number, Clasificacion: Clasificacion): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, Clasificacion);
    }
  
    delete(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
  }
  
  