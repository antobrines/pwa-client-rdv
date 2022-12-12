import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class MeetService {
  constructor(
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  createMeet(meet: any) {
    // add user connected to meet
    const userConnected = this.authService.GetAuth();
    userConnected.then((user) => {
      if (user) {
        meet.userUid = user.uid;
        return this.afs.collection('meets').add(meet);
      }
      return null;
    });
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
