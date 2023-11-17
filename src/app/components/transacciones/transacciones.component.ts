import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { GastosModel } from 'src/app/models/gastos.model';
import { IngresosModel } from 'src/app/models/ingresos.model';
import { TransaccionesModel } from 'src/app/models/transacciones.model';
import { GastosService } from 'src/app/services/gastos.service';
import { IngresosService } from 'src/app/services/ingresos.service';
import { StorageService } from 'src/app/services/storage.service';
import { TransaccionesService } from 'src/app/services/transacciones.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css'],
})
export class TransaccionesComponent {
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

  transacciones: TransaccionesModel[] = [];
  datePipe: DatePipe = new DatePipe('en-US');

  totalIngresos = 0;
  totalGastos = 0;
  totalTransaccionesGenerales = 0;

  mostrarModalAddIngreso = false;
  mostrarModalAddGasto = false;

  registroSeleccionado: any; // Para almacenar el registro a eliminar
  mostrarModalEliminacion = false;
  ingreso: IngresosModel;
  gasto: GastosModel;

  mostrarModalEditar = false;

  eliminadoConExito = false;
  editadoConExito = false;

  formEditarRegistro: TransaccionesModel;
  formEditarIngreso: IngresosModel;
  formEditarGasto: GastosModel;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private transaccionesService: TransaccionesService,
    private ingresoService: IngresosService,
    private gastoService: GastosService
  ) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.selectedMonth = this.allMonths[this.currentMonth];
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.obtenerMovimientosMonth();
    } else {
      this.router.navigate(['/login']);
    }
  }

  obtenerTodosLosMovimientos(): void {
    this.transaccionesService.obtenerTodosLosMovimientos().subscribe({
      next: (data) => {
        this.transacciones = this.formatearFechas(data);

        this.totalIngresos = 0; // Reiniciamos el total de ingresos a 0 antes de calcularlo nuevamente
        this.totalGastos = 0; // Reiniciamos el total de gastos a 0 antes de calcularlo nuevamente
        this.totalTransaccionesGenerales = 0; // Reiniciamos el total de transacciones generales a 0 antes de calcularlo nuevamente

        for (const transaccion of this.transacciones) {
          //Sumar ingresos
          if (transaccion.tipoMovimiento == 'ingreso') {
            if (transaccion.cantidad !== undefined) {
              this.totalIngresos += transaccion.cantidad;
            }
          }
          //Sumar gastos
          if (transaccion.tipoMovimiento == 'gasto') {
            if (transaccion.cantidad !== undefined) {
              this.totalGastos += transaccion.cantidad;
            }
          }
          //Sumar balance global
          if (transaccion.cantidad !== undefined) {
            this.totalTransaccionesGenerales += transaccion.cantidad;
          }
        }
      },
      error: (e) => console.error(e),
    });
  }

  obtenerMovimientosMonth(): void {
    this.transaccionesService
      .obtenerMovimientosMonth(
        (this.currentMonth + 1).toString(),
        this.currentYear.toString()
      )
      .subscribe({
        next: (data) => {
          this.transacciones = this.formatearFechas(data);

          this.totalIngresos = 0; // Reiniciamos el total de ingresos a 0 antes de calcularlo nuevamente
          this.totalGastos = 0; // Reiniciamos el total de gastos a 0 antes de calcularlo nuevamente
          this.totalTransaccionesGenerales = 0; // Reiniciamos el total de transacciones generales a 0 antes de calcularlo nuevamente

          for (const transaccion of this.transacciones) {
            //Sumar ingresos
            if (transaccion.tipoMovimiento == 'ingreso') {
              if (transaccion.cantidad !== undefined) {
                this.totalIngresos += transaccion.cantidad;
              }
            }
            //Sumar gastos
            if (transaccion.tipoMovimiento == 'gasto') {
              if (transaccion.cantidad !== undefined) {
                this.totalGastos += transaccion.cantidad;
              }
            }
            //Sumar balance global
            if (transaccion.cantidad !== undefined) {
              this.totalTransaccionesGenerales += transaccion.cantidad;
            }
          }
        },
        error: (e) => console.error(e),
      });
  }

  obtenerMovimientosYear(): void {
    this.transaccionesService
      .obtenerMovimientosYear(this.currentYear.toString())
      .subscribe({
        next: (data) => {
          this.transacciones = this.formatearFechas(data);

          this.totalIngresos = 0; // Reiniciamos el total de ingresos a 0 antes de calcularlo nuevamente
          this.totalGastos = 0; // Reiniciamos el total de gastos a 0 antes de calcularlo nuevamente
          this.totalTransaccionesGenerales = 0; // Reiniciamos el total de transacciones generales a 0 antes de calcularlo nuevamente

          for (const transaccion of this.transacciones) {
            //Sumar ingresos
            if (transaccion.tipoMovimiento == 'ingreso') {
              if (transaccion.cantidad !== undefined) {
                this.totalIngresos += transaccion.cantidad;
              }
            }
            //Sumar gastos
            if (transaccion.tipoMovimiento == 'gasto') {
              if (transaccion.cantidad !== undefined) {
                this.totalGastos += transaccion.cantidad;
              }
            }
            //Sumar balance global
            if (transaccion.cantidad !== undefined) {
              this.totalTransaccionesGenerales += transaccion.cantidad;
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
      this.obtenerTodosLosMovimientos();
    } else if (vista === 'month') {
      this.obtenerMovimientosMonth();
    } else if (vista === 'year') {
      this.obtenerMovimientosYear();
    }
  }

  changeMonth(direction: string): void {
    if (direction === 'previous' && this.currentMonth > 0) {
      this.currentMonth--;
      this.obtenerMovimientosMonth();
    } else if (
      direction === 'next' &&
      this.currentMonth < this.allMonths.length - 1
    ) {
      this.currentMonth++;
      this.obtenerMovimientosMonth();
    }

    this.selectedMonth = this.allMonths[this.currentMonth];
  }

  changeYear(direction: string): void {
    if (direction === 'previous') {
      this.currentYear--;
      if (this.vistaHistorial === 'month') {
        this.obtenerMovimientosMonth();
      } else {
        this.obtenerMovimientosYear();
      }
    } else if (direction === 'next') {
      this.currentYear++;
      if (this.vistaHistorial === 'month') {
        this.obtenerMovimientosMonth();
      } else {
        this.obtenerMovimientosYear();
      }
    }
  }

  formatearFechas(transacciones: TransaccionesModel[]): TransaccionesModel[] {
    // Recorrer el array y formatear las fechas
    return transacciones.map((transaccion) => {
      // Verificar si la fecha no es null antes de formatearla
      if (transaccion.fecha) {
        transaccion.fecha =
          this.datePipe.transform(transaccion.fecha, 'yyyy-MM-dd') || ''; // Añade el '' como valor por defecto si el resultado es null
      }
      return transaccion;
    });
  }

  getBackgroundColor(tipoMovimiento: string): string {
    if (tipoMovimiento === 'gasto') {
      return '#8a2727'; // Color rojo para gastos
    } else if (tipoMovimiento === 'ingreso') {
      return 'rgb(26 109 26)'; // Color verde para ingresos
    }
    // Puedes manejar otros tipos de movimientos o el valor predeterminado aquí
    return 'white'; // Color blanco si no se especifica
  }
  getBorderColor(tipoMovimiento: string): string {
    if (tipoMovimiento === 'gasto') {
      return '#ff0000'; // Color rojo para gastos
    } else if (tipoMovimiento === 'ingreso') {
      // border-color: #0bff0b;
      return '#0bff0b'; // Color verde para ingresos
    }
    return 'white'; // Color blanco si no se especifica
  }

  abrirModalIngreso() {
    this.mostrarModalAddIngreso = true;
  }

  cerrarModalIngreso(event: boolean): void {
    if (this.vistaHistorial === 'completo') {
      this.obtenerTodosLosMovimientos();
    } else if (this.vistaHistorial === 'month') {
      this.obtenerMovimientosMonth();
    } else if (this.vistaHistorial === 'year') {
      this.obtenerMovimientosYear();
    }
    this.mostrarModalAddIngreso = event; // Evento es un booleano, cambia el estado del modal
  }

  abrirModalGasto() {
    this.mostrarModalAddGasto = true;
  }

  cerrarModalGasto(event: boolean): void {
    if (this.vistaHistorial === 'completo') {
      this.obtenerTodosLosMovimientos();
    } else if (this.vistaHistorial === 'month') {
      this.obtenerMovimientosMonth();
    } else if (this.vistaHistorial === 'year') {
      this.obtenerMovimientosYear();
    }
    this.mostrarModalAddGasto = event; // Evento es un booleano, cambia el estado del modal
  }

  abrirModalEliminar(transaccion: TransaccionesModel): void {
    this.registroSeleccionado = transaccion; //Almacena el registro a eliminar
    this.mostrarModalEliminacion = true; //Muestra el modal de confirmación
  }

  confirmarEliminacion(): void {
    this.registroSeleccionado.fecha = ''; //Borrar la fecha para evitar errores de formato
    if (this.registroSeleccionado.tipoMovimiento == 'ingreso') {
      this.ingreso = {
        id: this.registroSeleccionado.id,
        descripcion: this.registroSeleccionado.descripcion,
        cantidad: this.registroSeleccionado.cantidad,
        fecha: '',
        usuarioId: this.registroSeleccionado.usuarioId,
      };

      this.ingresoService.eliminarIngreso(this.ingreso).subscribe({
        next: () => {
          // Eliminación exitosa
          this.mostrarModalEliminacion = false; // Cierra el modal
          if (this.vistaHistorial === 'completo') {
            this.obtenerTodosLosMovimientos();
          } else if (this.vistaHistorial === 'month') {
            this.obtenerMovimientosMonth();
          } else if (this.vistaHistorial === 'year') {
            this.obtenerMovimientosYear();
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
    } else {
      this.gasto = {
        id: this.registroSeleccionado.id,
        descripcion: this.registroSeleccionado.descripcion,
        cantidad: this.registroSeleccionado.cantidad,
        fecha: '',
        usuarioId: this.registroSeleccionado.usuarioId,
      };

      this.gastoService.eliminarGasto(this.gasto).subscribe({
        next: () => {
          // Eliminación exitosa
          this.mostrarModalEliminacion = false; // Cierra el modal
          if (this.vistaHistorial === 'completo') {
            this.obtenerTodosLosMovimientos();
          } else if (this.vistaHistorial === 'month') {
            this.obtenerMovimientosMonth();
          } else if (this.vistaHistorial === 'year') {
            this.obtenerMovimientosYear();
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

  abrirModalEditar(transaccion: TransaccionesModel): void {
    this.formEditarRegistro = {
      id: transaccion.id,
      descripcion: transaccion.descripcion,
      cantidad: transaccion.cantidad,
      fecha: transaccion.fecha,
      usuarioId: transaccion.usuarioId,
      tipoMovimiento: transaccion.tipoMovimiento,
    };
    this.mostrarModalEditar = true; //Muestra el modal de confirmación
  }

  editarRegistro(): void {
    if (this.formEditarRegistro.tipoMovimiento == 'ingreso') {
      this.formEditarIngreso = {
        id: this.formEditarRegistro.id,
        descripcion: this.formEditarRegistro.descripcion,
        cantidad: this.formEditarRegistro.cantidad,
        fecha: this.formEditarRegistro.fecha,
        usuarioId: this.formEditarRegistro.usuarioId,
      };

      const fechaFormateada = this.datePipe.transform(
        this.formEditarIngreso.fecha,
        'yyyy-MM-ddTHH:mm:ss'
      );
      this.formEditarIngreso.fecha = fechaFormateada || '';
      this.ingresoService.editarIngreso(this.formEditarIngreso).subscribe({
        next: () => {
          // Edición exitosa
          this.mostrarModalEditar = false; // Cierra el modal
          if (this.vistaHistorial === 'completo') {
            this.obtenerTodosLosMovimientos();
          } else if (this.vistaHistorial === 'month') {
            this.obtenerMovimientosMonth();
          } else if (this.vistaHistorial === 'year') {
            this.obtenerMovimientosYear();
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
    } else {
      this.formEditarGasto = {
        id: this.formEditarRegistro.id,
        descripcion: this.formEditarRegistro.descripcion,
        cantidad: this.formEditarRegistro.cantidad,
        fecha: this.formEditarRegistro.fecha,
        usuarioId: this.formEditarRegistro.usuarioId,
      };
      const fechaFormateada = this.datePipe.transform(
        this.formEditarGasto.fecha,
        'yyyy-MM-ddTHH:mm:ss'
      );
      this.formEditarGasto.fecha = fechaFormateada || '';
      this.gastoService.editarGasto(this.formEditarGasto).subscribe({
        next: () => {
          // Edición exitosa
          this.mostrarModalEditar = false; // Cierra el modal
          if (this.vistaHistorial === 'completo') {
            this.obtenerTodosLosMovimientos();
          } else if (this.vistaHistorial === 'month') {
            this.obtenerMovimientosMonth();
          } else if (this.vistaHistorial === 'year') {
            this.obtenerMovimientosYear();
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
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false; // Cierra el modal si se cancela la eliminación
  }
}
