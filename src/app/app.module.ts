import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatchPasswordDirective } from './directives/match-password.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { ModalAddGastoComponent } from './components/gastos/modal-add-gasto/modal-add-gasto.component';
import { ModalAddIngresoComponent } from './components/ingresos/modal-add-ingreso/modal-add-ingreso.component';
import { AvisoCookieComponent } from './components/aviso-cookie/aviso-cookie.component';
import { PoliticaCookiesComponent } from './components/aviso-cookie/politica-cookies/politica-cookies.component';
import { PoliticaPrivacidadComponent } from './components/aviso-cookie/politica-privacidad/politica-privacidad.component';

@NgModule({
  declarations: [
    AppComponent,
    IngresosComponent,
    GastosComponent,
    TransaccionesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MatchPasswordDirective,
    LoginComponent,
    RegisterComponent,
    ModalAddGastoComponent,
    ModalAddIngresoComponent,
    AvisoCookieComponent,
    PoliticaCookiesComponent,
    PoliticaPrivacidadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
