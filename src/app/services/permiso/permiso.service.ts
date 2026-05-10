import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPermiso, IPermisoPorModulo, ICreatePermisoDTO } from '../../models/permiso';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  private apiUrl = `${environment.apiUrl}/permisos`;

  constructor(private http: HttpClient) { }

  // Obtener todos los permisos
  getAll(): Observable<IPermiso[]> {
    return this.http.get<IPermiso[]>(this.apiUrl);
  }

  // Obtener permisos agrupados por módulo
  getPermisosPorModulo(): Observable<IPermisoPorModulo[]> {
    return this.http.get<IPermisoPorModulo[]>(`${this.apiUrl}/modulos`);
  }

  // Obtener permisos de un rol específico
  getPermisosByRol(rolId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/rol/${rolId}`);
  }

  // Asignar permiso a un rol
  asignarPermiso(rolId: number, permisoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar`, { rolId, permisoId });
  }

  // Remover permiso de un rol
  removerPermiso(rolId: number, permisoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rol/${rolId}/permiso/${permisoId}`);
  }

  // ============================================
  // CRUD de Permisos (para administración)
  // ============================================

  // Obtener un permiso por ID
  getById(id: number): Observable<IPermiso> {
    return this.http.get<IPermiso>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo permiso
  create(data: ICreatePermisoDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar permiso
  update(id: number, data: Partial<ICreatePermisoDTO>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar permiso
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener lista de módulos desde la base de datos
  getModulos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/modulos/list`);
  }


}