import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl: string = `${environment.apiUrl}/usuarios`; // Ajusta si tu endpoint es /usuario

  constructor(private http: HttpClient) { }

  // Método para enviar el "ping" de sesión activa
  pingSession(user:string): Observable<any> {
   
    return this.http.post(`${this.baseUrl}/session/ping`, {'usuario': user});
  }

  // Listar todos los usuarios
  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }


   // Buscar todos los usuarios 
  listAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/list`)
      .pipe(catchError(this.handleError));
  }

  // Buscar usuario por username
  searchUser(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/search/${username}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener usuario por ID
  getUserById(id: string | number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear usuario (con FormData para incluir foto)
  createUser(formData: FormData): Observable<{ message: string; id?: number }> {

    const result = this.http.post<{ message: string; id?: number }>(this.baseUrl, formData)
      .pipe(catchError(this.handleError));

    return result;
  }

  // Actualizar usuario (con FormData para incluir foto)
  // updateUser(id: string | number, formData: FormData): Observable<{ message: string }> {
  //   return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, formData)
  //     .pipe(catchError(this.handleError));
  // }

  update(id: string | number, user: Usuario): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, user)
      .pipe(catchError(this.handleError));
  }

  // Eliminar usuario
  deleteUser(id: string | number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Login
  // login(usuario: string, pass: string): Observable<Usuario> {
  //   return this.http.post<Usuario>(`${this.baseUrl}/login`, { usuario, pass })
  //     .pipe(catchError(this.handleError));
  // }

  // Logout
  logout(usuario: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/logout`, { usuario })
      .pipe(catchError(this.handleError));
  }

  // Usuarios Conectados
  getUsuariosConectados(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/conectados`)
      .pipe(catchError(this.handleError));
  }

  getUsuariosOnline(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/online`);
}

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o red
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Error del backend con mensaje personalizado
      errorMessage = error.error.message;
    } else {
      // Otros errores HTTP sin mensaje personalizado
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    // console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }


}
