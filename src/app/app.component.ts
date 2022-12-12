import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { registerLicense } from '@syncfusion/ej2-base';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pwa-client-rdv-14';
  constructor(public authService: AuthService) {
    registerLicense(environment.syncfusionKey);
  }

  logout() {
    this.authService.SignOut();
  }
}
