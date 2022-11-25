import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userData: any;
  loading = true;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // get uid from local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.authService.GetUserData(user.uid).subscribe((userData) => {
        this.loading = false;
        this.userData = userData;
      });
    }
  }

  signOut() {
    this.authService.SignOut();
  }
}
