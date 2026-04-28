import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComisionMiembro, ComisionMiembroDetalle, ComisionMiembroPlano, JefeComision } from '../../models/comisionMiembro';
import { GrupoComision, GrupoComision2 } from '../../models/grupoComision';

@Injectable({
  providedIn: 'root'
})
export class ComisionmiembrosService {
  private apiUrl = `${environment.apiUrl}/comisionmiembros`;

  constructor(private http: HttpClient) { }


  getAll(): Observable<ComisionMiembroPlano[]> {
    return this.http.get<ComisionMiembroPlano[]>(this.apiUrl);
  }

  listAll(): Observable<ComisionMiembroDetalle[]> {
    return this.http.get<ComisionMiembroDetalle[]>(`${this.apiUrl}/list`);
  }

  getById(id: number): Observable<ComisionMiembroDetalle> {
    return this.http.get<ComisionMiembroDetalle>(`${this.apiUrl}/${id}`);
  }


  MiembrosPorGrupo(idgrupo: number): Observable<GrupoComision2> {
    return this.http.get<GrupoComision2>(`${this.apiUrl}/miembros-por-grupo/${idgrupo}`);
  }


  getJefescomisiones(): Observable<JefeComision[]> {
    return this.http.get<JefeComision[]>(`${this.apiUrl}/jefes-comisiones`);
  }



  getByIdDetalle(id: number): Observable<ComisionMiembroDetalle> {
    return this.http.get<ComisionMiembroDetalle>(`${this.apiUrl}/${id}/detalle`);
  }

  create(Comision: ComisionMiembro): Observable<any> {
    return this.http.post(this.apiUrl, Comision);
  }

  update(id: number, Comision: ComisionMiembro): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, Comision);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


