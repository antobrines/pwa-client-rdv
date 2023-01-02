import { environment } from './../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MeetService {
  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  async createMeet(meet: any) {
    const userConnected = this.authService.GetAuth();
    const user = await userConnected;
    let isAdded = null;
    if (user) {
      meet.userUid = user.uid;
      const userData = await this.authService.getUserData(user.uid);
      meet.lat = userData?.lat;
      meet.lng = userData?.lng;
      meet.firstNameUser = userData?.firstName;
      meet.lastNameUser = userData?.lastName;
      isAdded = await this.afs.collection('meets').add(meet);
    }
    return isAdded;
  }

  async sendMessage(uid: string) {
    // get all token-messages wher uid = uid from firestore
    const tokens = await this.afs
      .collection('token-messages')
      .ref.where('uid', '==', uid)
      .get();

    for (const token of tokens.docs) {
      const tokenData: any = token.data();
      const tokenT = tokenData.token;
      this.sendNotification(tokenT);
    }
  }

  sendNotification(token: string) {
    console.log('token', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `key=${environment.firebase.messagingKey}`,
    });
    this.http
      .post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to: token,
          notification: {
            title: 'Nouvelle demande de rendez-vous',
            body: 'Vous avez une nouvelle demande de rendez-vous',
          },
        },
        { headers }
      )
      .subscribe((e) => console.log(e));
  }

  getMeetsUserDate(prestaUid: string, date: any) {
    return this.afs
      .collection('meets', (ref) =>
        ref.where('prestaUid', '==', prestaUid).where('date', '==', date)
      )
      .valueChanges();
  }

  getCategories() {
    return this.afs.collection('categories').valueChanges();
  }

  getSettingsUser(userId: string) {
    return this.afs
      .collection('settings', (ref) => ref.where('userId', '==', userId))
      .valueChanges();
  }

  getMyMeets(uid: string) {
    return this.afs
      .collection('meets', (ref) => ref.where('userUid', '==', uid))
      .valueChanges();
  }
}
