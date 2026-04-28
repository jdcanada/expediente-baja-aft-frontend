import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cargo, CargoDetalle } from '../../models/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private apiUrl = `${environment.apiUrl}/cargos`;

  constructor(private http: HttpClient) {}


  getAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.apiUrl);
  }

  listAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.apiUrl}/list`);
  }


  getById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.apiUrl}/${id}`);
  }


  getByIdDetalle(id: number): Observable<CargoDetalle> {
    return this.http.get<CargoDetalle>(`${this.apiUrl}/${id}/detalle`);
  }

  create(Cargo: Cargo): Observable<any> {
    return this.http.post(this.apiUrl, Cargo);
  }

  update(id: number, Cargo: Cargo): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, Cargo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

