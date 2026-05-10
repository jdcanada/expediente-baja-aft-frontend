import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GrupoComision, GrupoComisionDetalle, GrupoComisionListItem } from '../../models/grupoComision';


@Injectable({
  providedIn: 'root'
})
export class GrupoComisionService {
  private apiUrl = `${environment.apiUrl}/gruposcomision`;

  constructor(private http: HttpClient) {}

  // Listar todos los grupos (con detalles de comisión)
  getAll(): Observable<GrupoComision[]> {
    return this.http.get<GrupoComision[]>(this.apiUrl);
  }

  // Listar grupos con detalles de comisión y miembros
  getAllWithDetails(): Observable<GrupoComisionDetalle[]> {
    return this.http.get<GrupoComisionDetalle[]>(`${this.apiUrl}/detalles`);
  }

  // Listado simple para selects
  listAll(): Observable<GrupoComisionDetalle[]> {
    return this.http.get<GrupoComisionDetalle[]>(`${this.apiUrl}/list`);
  }

  // Obtener grupo por ID
  getById(id: number): Observable<GrupoComision> {
    return this.http.get<GrupoComision>(`${this.apiUrl}/${id}`);
  }

  // Obtener grupo con sus miembros
  getByIdWithMiembros(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/miembros`);
  }

  // Obtener miembros de un grupo específico
  getMiembrosByGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${grupoId}/miembros`);
  }

  // Obtener todas las comisiones (para selects)
  getComisiones(): Observable<{ id_comision: number; nombre_comision: string }[]> {
    return this.http.get<{ id_comision: number; nombre_comision: string }[]>(`${this.apiUrl}/comisiones`);
  }

  // Crear grupo
  create(data: { comision_id: number; nombre_grupo: string; descripcion?: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Actualizar grupo
  update(id: number, data: Partial<GrupoComision>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Agregar miembro a grupo
  addMiembro(data: { grupo_id: number; persona_id: number; es_responsable: boolean }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/miembros`, data);
  }

  // Eliminar miembro del grupo
  removeMiembro(idMiembro: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/miembros/${idMiembro}`);
  }

  // Eliminar grupo
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}