import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expediente, ExpedienteDetalle_3, ExpedienteDetalle_4, ExpedientePlano } from '../../models/expediente';
import { ExpedienteFormulario, ExpedienteFormulario2 } from '../../models/expedienteformulario';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  private apiUrl = `${environment.apiUrl}/expedientes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obtener todas las Expedientees
  getAll(): Observable<ExpedientePlano[]> {
    return this.http.get<ExpedientePlano[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listAll(): Observable<ExpedienteDetalle_4[]> {
    return this.http.get<ExpedienteDetalle_4[]>(`${this.apiUrl}/list`);
  }

  // Obtener Expediente por ID
  getById(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getByIdDetalle(id: number): Observable<ExpedienteDetalle_3> {
    return this.http.get<ExpedienteDetalle_3>(`${this.apiUrl}/${id}/detalle`);
  }

  // Crear nueva Expediente
  create(data: Expediente): Observable<{ id_expediente: number }> {
    return this.http.post<{ id_expediente: number }>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }


  // Actualizar Expediente existente
  update(id: number, data: ExpedienteDetalle_4): Observable<Expediente> {
    return this.http.put<Expediente>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Eliminar Expediente
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o red
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error?.message) {
      // Mensaje personalizado del backend
      errorMessage = error.error.message;
    } else {
      // Otros errores HTTP
      errorMessage = `Código: ${error.status} - Mensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


  // Obtener datos completos para regenerar documentos
  getDatosParaDocumento(id: number): Observable<ExpedienteFormulario> {
    return this.http.get<ExpedienteFormulario>(`${this.apiUrl}/${id}/datos-documento`);
  }

  // Obtener solo los medios (afts) de un expediente (alternativa)
  getMediosByExpediente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/medios`);
  }

  // Obtener estado de validación de un expediente
  getValidacion(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/validacion`)
      .pipe(catchError(this.handleError));
  }

  getInformeResumen(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/informe-resumen`)
      .pipe(catchError(this.handleError));
  }


  // Cambiar estado de expediente (aprobar)
  cambiarEstado(id: number, nuevoEstado: string): Observable<any> {
    const usuario = this.authService.getCurrentUser();
    return this.http.patch(`${this.apiUrl}/${id}/estado`, {
      nuevoEstado,
      usuarioId: usuario?.id_usuario
    }).pipe(catchError(this.handleError));
  }

  // Verificar si el usuario puede aprobar el expediente
  puedeAprobar(expediente: any): boolean {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return false;

    // Admin siempre puede aprobar
    if (usuario.id_rol === 1) return true;

    // El jefe que aprueba puede aprobar su expediente
    return expediente.aprobado_por_id === usuario.id_usuario;
  }


  // Generar movimientos automáticamente desde medios existentes
  generarMovimientosAutomaticos(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/generar-movimientos`, {})
      .pipe(catchError(this.handleError));
  }

  // Verificar si un expediente puede completarse (tiene medios y dictámenes)
  puedeCompletarse(expediente: any): boolean {
    // Solo si tiene medios y NO tiene movimientos aún
    return (expediente.total_medios || 0) > 0 && (expediente.total_movimientos || 0) === 0;
  }


}
