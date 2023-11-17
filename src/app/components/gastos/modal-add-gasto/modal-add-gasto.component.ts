import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { GastosModel } from 'src/app/models/gastos.model';
import { GastosService } from 'src/app/services/gastos.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-modal-add-gasto',
  templateUrl: './modal-add-gasto.component.html',
  styleUrls: ['./modal-add-gasto.component.css'],
})
export class ModalAddGastoComponent {
  datePipe: DatePipe = new DatePipe('en-US');

  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  gasto: GastosModel;

  formAddGasto: any = {
    descripcion: '',
    cantidad: 0,
    fecha: this.obtenerFechaActual(), // Establecer la fecha por defecto al inicializar el componente
  };

  isSuccessful = false;
  isFail = false;
  errorMessage = '';

  agregadoConExito = false;

  constructor(
    private storageService: StorageService,
    private gastosService: GastosService
  ) {}

  guardarGasto(): void {
    const fechaFormateada = this.datePipe.transform(
      this.formAddGasto.fecha,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.formAddGasto.fecha = fechaFormateada || '';
    const { descripcion, cantidad, fecha } = this.formAddGasto;
    this.gasto = {
      descripcion: descripcion,
      cantidad: cantidad,
      fecha: fecha,
      usuarioId: this.storageService.getUser().id,
    };
    this.gastosService.guardarGasto(this.gasto).subscribe({
      next: (data) => {
        this.isSuccessful = true;
        this.isFail = false;
        this.agregadoConExito = true;
        setTimeout(() => {
          // Redirección después de 3 segundos (3000 milisegundos)
          // Si el guardado es exitoso, emite el evento para cerrar el modal.
          this.agregadoConExito = false;
          this.cerrarModal.emit(false);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isFail = true;
      },
    });
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    // Formatear la fecha al formato YYYY-MM-DD requerido para el campo de tipo 'date' en HTML
    const formattedDate = fechaActual.toISOString().substring(0, 10);
    return formattedDate;
  }

  cerrarModalGasto(): void {
    this.cerrarModal.emit(false);
  }
}
