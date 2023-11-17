import { Component } from '@angular/core';
import { IngresosModel } from 'src/app/models/ingresos.model';
import { IngresosService } from 'src/app/services/ingresos.service';
import { DatePipe } from '@angular/common';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css'],
})
export class IngresosComponent {
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

  ingresos: IngresosModel[] = [];
  datePipe: DatePipe = new DatePipe('en-US');

  totalIngresos = 0;

  mostrarModalAddIngreso = false;

  registroSeleccionado: any; // Para almacenar el registro a eliminar
  mostrarModalEliminacion = false;

  mostrarModalEditar = false;

  eliminadoConExito = false;
  editadoConExito = false;

  formEditarIngreso: IngresosModel;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private ingresosService: IngresosService
  ) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.selectedMonth = this.allMonths[this.currentMonth];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.obtenerIngresosMonth();
    } else {
      this.router.navigate(['/login']);
    }
  }

  obtenerIngresos(): void {
    this.ingresosService.obtenerTodos().subscribe({
      next: (data) => {
        this.ingresos = this.formatearFechas(data);
        this.totalIngresos = 0; // Reiniciamos el total de ingresos a 0 antes de calcularlo nuevamente

        for (const ingreso of this.ingresos) {
          if (ingreso.cantidad !== undefined) {
            this.totalIngresos += ingreso.cantidad;
          }
        }
      },
      error: (e) => console.error(e),
    });
  }

  obtenerIngresosMonth(): void {
    this.ingresosService
      .obtenerIngresosMonth(
        (this.currentMonth + 1).toString(),
        this.currentYear.toString()
      )
      .subscribe({
        next: (data) => {
          this.ingresos = this.formatearFechas(data);
          this.totalIngresos = 0; // Reiniciamos el total de ingresos a 0 antes de calcularlo nuevamente

          for (const ingreso of this.ingresos) {
            if (ingreso.cantidad !== undefined) {
              this.totalIngresos += ingreso.cantidad;
            }
          }
        },
        error: (e) => console.error(e),
      });
  }

  obtenerIngresosYear(): void {
    this.ingresosService
      .obtenerIngresosYear(this.currentYear.toString())
      .subscribe({
        next: (data) => {
          this.ingresos = this.formatearFechas(data);
          this.totalIngresos = 0; // Reiniciamos el total de ingresos a 0 antes de calcularlo nuevamente

          for (const ingreso of this.ingresos) {
            if (ingreso.cantidad !== undefined) {
              this.totalIngresos += ingreso.cantidad;
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
      this.obtenerIngresos();
    } else if (vista === 'month') {
      this.obtenerIngresosMonth();
    } else if (vista === 'year') {
      this.obtenerIngresosYear();
    }
  }

  changeMonth(direction: string): void {
    if (direction === 'previous' && this.currentMonth > 0) {
      this.currentMonth--;
      this.obtenerIngresosMonth();
    } else if (direction === 'next' && this.currentMonth < 11) {
      this.currentMonth++;
      this.obtenerIngresosMonth();
    }

    this.selectedMonth = this.allMonths[this.currentMonth];
  }

  changeYear(direction: string): void {
    if (direction === 'previous') {
      this.currentYear--;
      if (this.vistaHistorial === 'month') {
        this.obtenerIngresosMonth();
      } else {
        this.obtenerIngresosYear();
      }
    } else if (direction === 'next') {
      this.currentYear++;
      if (this.vistaHistorial === 'month') {
        this.obtenerIngresosMonth();
      } else {
        this.obtenerIngresosYear();
      }
    }
  }

  formatearFechas(ingresos: IngresosModel[]): IngresosModel[] {
    // Recorrer el array y formatear las fechas
    return ingresos.map((ingreso) => {
      // Verificar si la fecha no es null antes de formatearla
      if (ingreso.fecha) {
        ingreso.fecha =
          this.datePipe.transform(ingreso.fecha, 'yyyy-MM-dd') || ''; // Añade el '' como valor por defecto si el resultado es null
      }
      return ingreso;
    });
  }

  abrirModalIngreso() {
    this.mostrarModalAddIngreso = true;
  }

  cerrarModalIngreso(event: boolean): void {
    if (this.vistaHistorial === 'completo') {
      this.obtenerIngresos();
    } else if (this.vistaHistorial === 'month') {
      this.obtenerIngresosMonth();
    } else if (this.vistaHistorial === 'year') {
      this.obtenerIngresosYear();
    }
    this.mostrarModalAddIngreso = event; // Evento es un booleano, cambia el estado del modal
  }

  abrirModalEliminar(ingreso: IngresosModel): void {
    this.registroSeleccionado = ingreso; //Almacena el registro a eliminar
    this.mostrarModalEliminacion = true; //Muestra el modal de confirmación
  }

  confirmarEliminacion(): void {
    this.registroSeleccionado.fecha = ''; //Borrar la fecha para evitar errores de formato
    if (this.registroSeleccionado) {
      this.ingresosService
        .eliminarIngreso(this.registroSeleccionado)
        .subscribe({
          next: () => {
            // Eliminación exitosa
            this.mostrarModalEliminacion = false; // Cierra el modal
            if (this.vistaHistorial === 'completo') {
              this.obtenerIngresos();
            } else if (this.vistaHistorial === 'month') {
              this.obtenerIngresosMonth();
            } else if (this.vistaHistorial === 'year') {
              this.obtenerIngresosYear();
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

  abrirModalEditar(ingreso: IngresosModel): void {
    this.formEditarIngreso = {
      id: ingreso.id,
      descripcion: ingreso.descripcion,
      cantidad: ingreso.cantidad,
      fecha: ingreso.fecha,
      usuarioId: ingreso.usuarioId,
    };

    this.mostrarModalEditar = true; //Muestra el modal de confirmación
  }

  editarIngreso(): void {
    const fechaFormateada = this.datePipe.transform(
      this.formEditarIngreso.fecha,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.formEditarIngreso.fecha = fechaFormateada || '';
    this.ingresosService.editarIngreso(this.formEditarIngreso).subscribe({
      next: () => {
        // Edición exitosa
        this.mostrarModalEditar = false; // Cierra el modal
        if (this.vistaHistorial === 'completo') {
          this.obtenerIngresos();
        } else if (this.vistaHistorial === 'month') {
          this.obtenerIngresosMonth();
        } else if (this.vistaHistorial === 'year') {
          this.obtenerIngresosYear();
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
