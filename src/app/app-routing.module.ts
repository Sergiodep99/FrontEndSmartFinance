import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PoliticaCookiesComponent } from './components/aviso-cookie/politica-cookies/politica-cookies.component';
import { PoliticaPrivacidadComponent } from './components/aviso-cookie/politica-privacidad/politica-privacidad.component';

const routes: Routes = [
  { path: 'inicio', component: TransaccionesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'gastos', component: GastosComponent },
  { path: 'politicaCookies', component: PoliticaCookiesComponent },
  { path: 'politicaPrivacidad', component: PoliticaPrivacidadComponent },
  {path: '**', redirectTo: 'inicio' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
