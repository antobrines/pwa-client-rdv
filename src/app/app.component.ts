import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { registerLicense } from '@syncfusion/ej2-base';
import { environment } from '../environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pwa-client-rdv-14';
  constructor(
    public authService: AuthService,
    private swUpdate: SwUpdate,
    private router: Router
  ) {
    registerLicense(environment.syncfusionKey);
  }

  logout() {
    this.authService.SignOut();
  }
}
