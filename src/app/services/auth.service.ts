import { User } from './../models/user';
import { EventEmitter, Injectable, NgZone, Output } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
    private location: Location
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
          this.GetUserData(result.user.uid).subscribe((user) => {
            if (user) {
              this.router.navigate(['dashboard']);
            }
          });
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SignUp(user: User, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.CreateUser(user, result.user);
        this.router.navigate(['confirm-email']);
        this.SignOut(false);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification({
        url: `${window.location.origin}/confirm-email?confirm=true`,
      }))
      .then(() => {
        // TODO EMAIL PAGE
      });
  }

  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  CreateUser(user: User, firebaseUser: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${firebaseUser.uid}`
    );
    const userData: User = {
      uid: firebaseUser.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      city: user.city,
      postal_code: user.postal_code,
      latitude: user.latitude,
      longitude: user.longitude,
      isPrestatary: user.isPrestatary,

    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  GetUserData(uid: string) {
    return this.afs.doc(`users/${uid}`).valueChanges();
  }

  SignOut(redirect = true) {
    return this.afAuth.signOut().then(() => {
      localStorage.clear();
      this.isLoggedIn.emit(false);
      if(redirect)
        this.router.navigate(['']);
    });
  }

  GetAuth() {}
}
