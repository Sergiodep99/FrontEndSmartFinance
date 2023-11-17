import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GastosModel } from '../models/gastos.model';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/gastos/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class GastosService {
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<GastosModel[]> {
    return this.http.get<GastosModel[]>(AUTH_API + 'obtenerTodos');
  }

  obtenerGastosMonth(month: string, year: string): Observable<GastosModel[]> {
    return this.http.get<GastosModel[]>(
      AUTH_API + 'gastosMonth' + '/' + month + '/' + year
    );
  }

  obtenerGastosYear(year: string): Observable<GastosModel[]> {
    return this.http.get<GastosModel[]>(AUTH_API + 'gastosYear' + '/' + year);
  }

  guardarGasto(gasto: GastosModel): Observable<any> {
    return this.http.post<any>(AUTH_API + 'crearGasto', gasto, httpOptions);
  }

  eliminarGasto(gasto: GastosModel): Observable<any> {
    return this.http.delete<any>(AUTH_API + 'eliminarGasto', {
      headers: httpOptions.headers,
      body: gasto,
    });
  }

  editarGasto(gasto: GastosModel): Observable<any> {
    return this.http.put<any>(AUTH_API + 'actualizarGasto', gasto, httpOptions);
  }
}
