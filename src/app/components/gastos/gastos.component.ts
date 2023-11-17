import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { GastosModel } from 'src/app/models/gastos.model';
import { GastosService } from 'src/app/services/gastos.service';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css'],
})
export class GastosComponent {
  icons = {
    arrowLeft: faArrowCircleLeft,
    arrowRight: faArrowCircleRight,
    trash: faTrash,
    edit: faEdit,
  };

  mostrarVistaCompleta: boolean = false;
  vistaHistorial: string = 'month'; // Por defecto, mostrar historial por mes

  selectedMonth: string;
  currentMonth: number;
  currentYear: number;
  allMonths = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  gastos: GastosModel[] = [];
  datePipe: DatePipe = new DatePipe('en-US');

  totalGastos = 0;

  mostrarModalAddGasto = false;

  registroSeleccionado: any; // Para almacenar el registro a eliminar
  mostrarModalEliminacion = false;

  mostrarModalEditar = false;

  eliminadoConExito = false;
  editadoConExito = false;

  formEditarGasto: GastosModel;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private gastosService: GastosService
  ) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.selectedMonth = this.allMonths[this.currentMonth];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.obtenerGastosMonth();
    } else {
      this.router.navigate(['/login']);
    }
  }

  obtenerGastos(): void {
    this.gastosService.obtenerTodos().subscribe({
      next: (data) => {
        this.gastos = this.formatearFechas(data);
        this.totalGastos = 0; // Reiniciamos el total de gastos a 0 antes de calcularlo nuevamente

        for (const gasto of this.gastos) {
          if (gasto.cantidad !== undefined) {
            this.totalGastos += gasto.cantidad;
          }
        }
      },
      error: (e) => console.error(e),
    });
  }

  obtenerGastosMonth(): void {
    this.gastosService
      .obtenerGastosMonth(
        (this.currentMonth + 1).toString(),
        this.currentYear.toString()
      )
      .subscribe({
        next: (data) => {
          this.gastos = this.formatearFechas(data);
          this.totalGastos = 0; // Reiniciamos el total de gastos a 0 antes de calcularlo nuevamente

          for (const gasto of this.gastos) {
            if (gasto.cantidad !== undefined) {
              this.totalGastos += gasto.cantidad;
            }
          }
        },
        error: (e) => console.error(e),
      });
  }

  obtenerGastosYear(): void {
    this.gastosService
      .obtenerGastosYear(this.currentYear.toString())
      .subscribe({
        next: (data) => {
          this.gastos = this.formatearFechas(data);
          this.totalGastos = 0; // Reiniciamos el total de gastos a 0 antes de calcularlo nuevamente

          for (const gasto of this.gastos) {
            if (gasto.cantidad !== undefined) {
              this.totalGastos += gasto.cantidad;
            }
          }
        },
        error: (e) => console.error(e),
      });
  }

  cambiarVista(vista: string) {
    this.mostrarVistaCompleta = vista === 'completo';
    this.vistaHistorial = vista;
    if (this.mostrarVistaCompleta) {
      this.obtenerGastos();
    } else if (vista === 'month') {
      this.obtenerGastosMonth();
    } else if (vista === 'year') {
      this.obtenerGastosYear();
    }
  }

  changeMonth(direction: string): void {
    if (direction === 'previous' && this.currentMonth > 0) {
      this.currentMonth--;
      this.obtenerGastosMonth();
    } else if (direction === 'next' && this.currentMonth < 11) {
      this.currentMonth++;
      this.obtenerGastosMonth();
    }

    this.selectedMonth = this.allMonths[this.currentMonth];
  }

  changeYear(direction: string): void {
    if (direction === 'previous') {
      this.currentYear--;
      if (this.vistaHistorial === 'month') {
        this.obtenerGastosMonth();
      } else {
        this.obtenerGastosYear();
      }
    } else if (direction === 'next') {
      this.currentYear++;
      if (this.vistaHistorial === 'month') {
        this.obtenerGastosMonth();
      } else {
        this.obtenerGastosYear();
      }
    }
  }

  formatearFechas(gastos: GastosModel[]): GastosModel[] {
    // Recorrer el array y formatear las fechas
    return gastos.map((gasto) => {
      // Verificar si la fecha no es null antes de formatearla
      if (gasto.fecha) {
        gasto.fecha = this.datePipe.transform(gasto.fecha, 'yyyy-MM-dd') || ''; // Añade el '' como valor por defecto si el resultado es null
      }
      return gasto;
    });
  }

  abrirModalGasto() {
    this.mostrarModalAddGasto = true;
  }

  cerrarModalGasto(event: boolean): void {
    if (this.vistaHistorial === 'completo') {
      this.obtenerGastos();
    } else if (this.vistaHistorial === 'month') {
      this.obtenerGastosMonth();
    } else if (this.vistaHistorial === 'year') {
      this.obtenerGastosYear();
    }
    this.mostrarModalAddGasto = event; // Evento es un booleano, cambia el estado del modal
  }

  abrirModalEliminar(gasto: GastosModel): void {
    this.registroSeleccionado = gasto; //Almacena el registro a eliminar
    this.mostrarModalEliminacion = true; //Muestra el modal de confirmación
  }

  confirmarEliminacion(): void {
    this.registroSeleccionado.fecha = ''; //Borrar la fecha para evitar errores de formato
    if (this.registroSeleccionado) {
      this.gastosService.eliminarGasto(this.registroSeleccionado).subscribe({
        next: () => {
          // Eliminación exitosa
          this.mostrarModalEliminacion = false; // Cierra el modal
          if (this.vistaHistorial === 'completo') {
            this.obtenerGastos();
          } else if (this.vistaHistorial === 'month') {
            this.obtenerGastosMonth();
          } else if (this.vistaHistorial === 'year') {
            this.obtenerGastosYear();
          }
          this.eliminadoConExito = true;
          setTimeout(() => {
            // Redirección después de 5 segundos (5000 milisegundos)
            // Si el guardado es exitoso, emite el evento para cerrar el modal.
            this.eliminadoConExito = false;
          }, 5000);
        },
        error: (e) => {
          console.error('Error al eliminar el registro:', e);
          // Manejar el error de eliminación, si es necesario
        },
      });
    }
  }

  cancelarEliminacion(): void {
    this.mostrarModalEliminacion = false; // Cierra el modal si se cancela la eliminación
  }

  abrirModalEditar(gasto: GastosModel): void {
    this.formEditarGasto = {
      id: gasto.id,
      descripcion: gasto.descripcion,
      cantidad: gasto.cantidad,
      fecha: gasto.fecha,
      usuarioId: gasto.usuarioId,
    };

    this.mostrarModalEditar = true; //Muestra el modal de confirmación
  }

  editarGasto(): void {
    const fechaFormateada = this.datePipe.transform(
      this.formEditarGasto.fecha,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.formEditarGasto.fecha = fechaFormateada || '';
    this.gastosService.editarGasto(this.formEditarGasto).subscribe({
      next: () => {
        // Edición exitosa
        this.mostrarModalEditar = false; // Cierra el modal
        if (this.vistaHistorial === 'completo') {
          this.obtenerGastos();
        } else if (this.vistaHistorial === 'month') {
          this.obtenerGastosMonth();
        } else if (this.vistaHistorial === 'year') {
          this.obtenerGastosYear();
        }
        this.editadoConExito = true;
        setTimeout(() => {
          // Redirección después de 5 segundos (5000 milisegundos)
          // Si el guardado es exitoso, emite el evento para cerrar el modal.
          this.editadoConExito = false;
        }, 5000);
      },
      error: (e) => {
        console.error('Error al editar el registro:', e);
        // Manejar el error de edición, si es necesario
      },
    });
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false; // Cierra el modal si se cancela la eliminación
  }
}
