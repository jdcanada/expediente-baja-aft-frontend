import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DictamenDetalle_new, DictamenListado } from '../../models/dictamen';



@Injectable({ providedIn: 'root' })
export class DictamenService {
  private apiUrl = `${environment.apiUrl}/dictamenes`;

  constructor(private http: HttpClient) { }

  listAll(): Observable<DictamenListado[]> {
    return this.http.get<DictamenListado[]>(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<DictamenDetalle_new> {
    return this.http.get<DictamenDetalle_new>(`${this.apiUrl}/detalle/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // En el servicio
  getDetalle(id: number): Observable<DictamenDetalle_new> {
    return this.http.get<DictamenDetalle_new>(`${this.apiUrl}/detalle/${id}`);
  }
}