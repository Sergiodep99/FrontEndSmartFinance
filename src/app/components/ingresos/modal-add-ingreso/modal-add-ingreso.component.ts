import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { IngresosModel } from 'src/app/models/ingresos.model';
import { IngresosService } from 'src/app/services/ingresos.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-modal-add-ingreso',
  templateUrl: './modal-add-ingreso.component.html',
  styleUrls: ['./modal-add-ingreso.component.css'],
})
export class ModalAddIngresoComponent {
  datePipe: DatePipe = new DatePipe('en-US');

  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  ingreso: IngresosModel;

  formAddIngreso: IngresosModel = {
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
    private ingresosService: IngresosService
  ) {}

  guardarIngreso(): void {
    const fechaFormateada = this.datePipe.transform(
      this.formAddIngreso.fecha,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.formAddIngreso.fecha = fechaFormateada || '';
    const { descripcion, cantidad, fecha } = this.formAddIngreso;
    this.ingreso = {
      descripcion: descripcion,
      cantidad: cantidad,
      fecha: fecha,
      usuarioId: this.storageService.getUser().id,
    };
    this.ingresosService.guardarIngreso(this.ingreso).subscribe({
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

  cerrarModalIngreso(): void {
    this.cerrarModal.emit(false);
  }
}
