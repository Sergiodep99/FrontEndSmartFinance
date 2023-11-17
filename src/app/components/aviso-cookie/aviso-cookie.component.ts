import { Component, EventEmitter, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-aviso-cookie',
  templateUrl: './aviso-cookie.component.html',
  styleUrls: ['./aviso-cookie.component.css']
})
export class AvisoCookieComponent {
  @Output() cookieAceptada = new EventEmitter<void>();

  constructor(private cookieService: CookieService) {}

  aceptarCookie() {
    this.cookieService.set('cookieAceptada', 'true', 365); // Guarda la cookie por un año
    this.cookieAceptada.emit();
  }
}
