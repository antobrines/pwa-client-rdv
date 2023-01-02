import { User } from './../models/user';
import { EventEmitter, Injectable, NgZone, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { GeofireService } from './geofire.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @Output() public isLoggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private toast: HotToastService,
    private geofireService: GeofireService
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
        this.isLoggedIn.emit(true);
      } else {
        localStorage.setItem('user', null!);
        JSON.parse(localStorage.getItem('user')!);
        this.isLoggedIn.emit(false);
      }
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          this.GetUserData(result.user.uid).subscribe((user: any) => {
            if (user) {
              this.router.navigate(['dashboard']);
            }
          });
        }
      })
      .catch((error) => {
        this.toast.error(error.message);
      });
  }

  SignUp(user: User, password: string) {
    this.toast.loading("Votre compte est en train d'être crée", {
      id: 'userCreated',
      autoClose: false,
    });
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.CreateUser(user, result.user).then((e) => {
          this.router.navigate(['confirm-email']);
          this.SignOut(false);
          this.toast.close('userCreated');
        });
      })
      .catch((error) => {
        this.toast.close('userCreated');
        this.toast.error(error.message);
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) =>
        u.sendEmailVerification({
          url: `${window.location.origin}/confirm-email?confirm=true`,
        })
      )
      .then(() => {
        // TODO EMAIL PAGE
      });
  }

  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.toast.success('Demande de réinitialisation envoyée');
      })
      .catch((error) => {
        this.toast.error(error.message);
      });
  }

  CreateUser(user: User, firebaseUser: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${firebaseUser.uid}`
    );
    const hash = this.geofireService.getHash(user.lat, user.lng);
    const userData: User = {
      uid: firebaseUser.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      city: user.city,
      postal_code: user.postal_code,
      lat: user.lat,
      lng: user.lng,
      isPrestatary: user.isPrestatary,
      geohash: hash,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  GetUserData(uid: string) {
    return this.afs.doc(`users/${uid}`).valueChanges();
  }

  async getUserData(uid: string): Promise<any> {
    const user = await this.afs.doc(`users/${uid}`).get().toPromise();
    return user?.data();
  }

  SignOut(redirect = true) {
    return this.afAuth.signOut().then(() => {
      localStorage.clear();
      this.isLoggedIn.emit(false);
      if (redirect) this.router.navigate(['']);
    });
  }

  GetAuth() {
    return this.afAuth.currentUser;
  }
}
