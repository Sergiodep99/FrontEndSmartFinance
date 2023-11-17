import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  nombre?: string;
  currentRoute: string;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Inicializar la ruta actual al cargar el componente
    this.updateCurrentRoute();

    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.nombre = user.nombre;
    }
    // Suscribirse a cambios de ruta para actualizar la ruta actual
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentRoute();
      });
  }

  private updateCurrentRoute() {
    const path =
      this.activatedRoute.snapshot.firstChild?.routeConfig?.path || '';
    this.currentRoute = capitalizeFirstLetter(path);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.storageService.clean();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
