import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Muestra un mensaje de éxito, error, info o advertencia en snackbar o modal.
   * @param message Texto principal del mensaje.
   * @param usarModal true para SweetAlert2, false para Snackbar.
   * @param type Tipo de mensaje: 'success' | 'error' | 'info' | 'warning' | 'question'.
   * @param title Título opcional para el modal.
   * @param duration Duración en ms para el snackbar (por defecto 5000).
   * @param panelClass Clase CSS para personalizar el snackbar.
   */
  mostrarMensaje(
    message: string,
    usarModal: boolean = false,
    type: SweetAlertIcon = 'success',
    title: string = '',
    duration: number = 5000,
    panelClass: string = 'snackbar-success'
  ) {
    if (usarModal) {
      Swal.fire({
        icon: type,
        title: title || this.getDefaultTitle(type),
        text: message,
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.snackBar.open(message, 'Cerrar', {
        duration,
        panelClass: [panelClass || this.getDefaultPanelClass(type)]
      });
    }
  }

  /**
   * Muestra un diálogo de confirmación y retorna una promesa con true/false.
   * @param mensaje Mensaje de confirmación.
   * @param titulo Título del diálogo.
   * @param icono Icono de SweetAlert2.
   * @param confirmButtonText Texto del botón de confirmar.
   * @param cancelButtonText Texto del botón de cancelar.
   * @returns Promise<boolean> true si el usuario confirma, false si cancela.
   */
  confirmarAccion(
    mensaje: string,
    titulo: string = '¿Está seguro?',
    icono: SweetAlertIcon = 'question',
    confirmButtonText: string = 'Sí, confirmar',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true
    }).then(result => result.isConfirmed);
  }

  private getDefaultTitle(type: SweetAlertIcon): string {
    switch (type) {
      case 'success': return '¡Éxito!';
      case 'error': return '¡Error!';
      case 'info': return 'Información';
      case 'warning': return '¡Advertencia!';
      case 'question': return '¿Está seguro?';
      default: return '';
    }
  }

  private getDefaultPanelClass(type: SweetAlertIcon): string {
    switch (type) {
      case 'success': return 'snackbar-success';
      case 'error': return 'snackbar-error';
      case 'info': return 'snackbar-info';
      case 'warning': return 'snackbar-warning';
      default: return 'snackbar-default';
    }
  }
}
