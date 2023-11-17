import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IngresosModel } from '../models/ingresos.model';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/ingresos/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class IngresosService {
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<IngresosModel[]> {
    return this.http.get<IngresosModel[]>(AUTH_API + 'obtenerTodos');
  }

  obtenerIngresosMonth(
    month: string,
    year: string
  ): Observable<IngresosModel[]> {
    return this.http.get<IngresosModel[]>(
      AUTH_API + 'ingresosMonth' + '/' + month + '/' + year
    );
  }

  obtenerIngresosYear(year: string): Observable<IngresosModel[]> {
    return this.http.get<IngresosModel[]>(
      AUTH_API + 'ingresosYear' + '/' + year
    );
  }

  guardarIngreso(ingreso: IngresosModel): Observable<any> {
    return this.http.post<any>(AUTH_API + 'crearIngreso', ingreso, httpOptions);
  }

  eliminarIngreso(ingreso: IngresosModel): Observable<any> {
    return this.http.delete<any>(AUTH_API + 'eliminarIngreso', {
      headers: httpOptions.headers,
      body: ingreso,
    });
  }

  editarIngreso(ingreso: IngresosModel): Observable<any> {
    return this.http.put<any>(
      AUTH_API + 'actualizarIngreso',
      ingreso,
      httpOptions
    );
  }
}
