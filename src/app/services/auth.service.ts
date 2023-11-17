import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  public signup(
    nombre: string,
    apellidos: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.httpClient.post<any>(
      AUTH_API + 'signup',
      {
        nombre,
        apellidos,
        email,
        password,
      },
      httpOptions
    );
  }

  public login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      AUTH_API + 'signin',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
