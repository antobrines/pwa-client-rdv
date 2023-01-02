import { MeetService } from './../../../services/meet.service';
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
  myMeets: any = null;
  constructor(
    private authService: AuthService,
    private meetService: MeetService
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.authService.GetUserData(user.uid).subscribe((userData) => {
        this.loading = false;
        this.userData = userData;
      });
      this.meetService.getMyMeets(user.uid).subscribe((meets: any) => {
        this.myMeets = meets;
        this.myMeets.forEach((meet: any) => {
          this.authService.GetUserData(meet.prestaUid).subscribe((presta) => {
            meet.presta = presta;
          });
        });
      });
    }
  }

  signOut() {
    this.authService.SignOut();
  }
}
