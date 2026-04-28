// caracteristica.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Caracteristica, CaracteristicaDetalle } from '../../models/caracteristica';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })

export class CaracteristicaService {
  private apiUrl = `${environment.apiUrl}/caracteristicas`;

  constructor(private http: HttpClient) {}


  getAll(): Observable<Caracteristica[]> {
    return this.http.get<Caracteristica[]>(this.apiUrl);
  }

  listAll(): Observable<Caracteristica[]> {
    return this.http.get<Caracteristica[]>(`${this.apiUrl}/list`);
  }


  getById(id: number): Observable<Caracteristica> {
    return this.http.get<Caracteristica>(`${this.apiUrl}/${id}`);
  }
  getByIdDetalle(id: number): Observable<CaracteristicaDetalle> {
    return this.http.get<CaracteristicaDetalle>(`${this.apiUrl}/${id}/detalle`);
  }

  create(caracteristica: Caracteristica): Observable<any> {
    
    return this.http.post(this.apiUrl, caracteristica);
  }

  update(id: number, caracteristica: Caracteristica): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, caracteristica);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

