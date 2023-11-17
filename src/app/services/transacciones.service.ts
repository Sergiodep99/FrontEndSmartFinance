import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransaccionesModel } from '../models/transacciones.model';

const AUTH_API = 'http://localhost:8080/api/movimientos/';

@Injectable({
  providedIn: 'root',
})
export class TransaccionesService {
  constructor(private http: HttpClient) {}

  obtenerTodosLosMovimientos(): Observable<TransaccionesModel[]> {
    return this.http.get<TransaccionesModel[]>(
      AUTH_API + 'obtenerTodosLosMovimientos'
    );
  }

  obtenerMovimientosMonth(
    month: string,
    year: string
  ): Observable<TransaccionesModel[]> {
    return this.http.get<TransaccionesModel[]>(
      AUTH_API + 'obtenerMovimientosMonth' + '/' + month + '/' + year
    );
  }

  obtenerMovimientosYear(year: string): Observable<TransaccionesModel[]> {
    return this.http.get<TransaccionesModel[]>(
      AUTH_API + 'obtenerMovimientosYear' + '/' + year
    );
  }
}
