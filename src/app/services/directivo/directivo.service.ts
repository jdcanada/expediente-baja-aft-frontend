import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Directivo, DirectivoDetalle, DirectivoPlano } from '../../models/directivo';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DirectivoService {
private apiUrl = `${environment.apiUrl}/directivos`;
  
    constructor(private http: HttpClient) {}
  
  
    getAll(): Observable<DirectivoPlano[]> {
      return this.http.get<DirectivoPlano[]>(this.apiUrl);
    }
  
    listAll(): Observable<DirectivoDetalle[]> {
      return this.http.get<DirectivoDetalle[]>(`${this.apiUrl}/list`);
    }
    
    getById(id: number): Observable<DirectivoDetalle> {
      return this.http.get<DirectivoDetalle>(`${this.apiUrl}/${id}`);
    }
  
  
    getByIdDetalle(id: number): Observable<DirectivoDetalle> {
      return this.http.get<DirectivoDetalle>(`${this.apiUrl}/${id}/detalle`);
    }
  
    create(Directivo: Directivo): Observable<any> {
      return this.http.post(this.apiUrl, Directivo);
    }
  
    update(id: number, Directivo: DirectivoDetalle): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, Directivo);
    }
  
    delete(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
  }
  
  
