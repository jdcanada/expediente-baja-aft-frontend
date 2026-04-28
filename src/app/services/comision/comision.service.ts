import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Comision, ComisionDetalle } from '../../models/comision';
import { Observable } from 'rxjs';
import { GrupoComision } from '../../models/grupoComision';

@Injectable({
  providedIn: 'root'
})
export class ComisionService {
  private apiUrl = `${environment.apiUrl}/comisiones`;

  constructor(private http: HttpClient) { }


  getAll(): Observable<Comision[]> {
    return this.http.get<Comision[]>(this.apiUrl);
  }

  listAll(): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<Comision> {
    return this.http.get<Comision>(`${this.apiUrl}/${id}`);
  }




  getByIdDetalle(id: number): Observable<ComisionDetalle> {
    return this.http.get<ComisionDetalle>(`${this.apiUrl}/${id}/detalle`);
  }

  create(Comision: Comision): Observable<any> {
    return this.http.post(this.apiUrl, Comision);
  }

  update(id: number, Comision: Comision): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, Comision);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

