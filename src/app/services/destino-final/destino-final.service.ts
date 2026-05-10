import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DestinoFinal, DestinoFinalSimple } from '../../models/destino-final';

@Injectable({
  providedIn: 'root'
})
export class DestinoFinalService {
  private apiUrl = `${environment.apiUrl}/destinos-finales`;

  constructor(private http: HttpClient) {}

  // Listado paginado y filtrado
  getAll(page?: number, limit?: number, search?: string): Observable<any> {
    let params = '';
    if (page !== undefined && limit !== undefined) {
      params = `?page=${page}&limit=${limit}`;
      if (search) {
        params += `&search=${search}`;
      }
    } else if (search) {
      params = `?search=${search}`;
    }
    return this.http.get<any>(`${this.apiUrl}${params}`);
  }

  // Listado simple para selects (solo id y descripcion)
  listAll(): Observable<DestinoFinalSimple[]> {
    return this.http.get<DestinoFinalSimple[]>(`${this.apiUrl}/list`);
  }

  // Obtener por ID
  getById(id: number): Observable<DestinoFinal> {
    return this.http.get<DestinoFinal>(`${this.apiUrl}/${id}`);
  }

  // Obtener detalle completo
  getDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear destino final
  create(data: { descripcion: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Actualizar destino final
  update(id: number, data: { descripcion?: string; activo?: boolean }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar destino final (borrado lógico)
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}