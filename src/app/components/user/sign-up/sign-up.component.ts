import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleService } from 'src/app/services/google.service';

export function matchValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo];
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  errorMessage = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    matchValidator('confirmPassword', true),
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    matchValidator('password'),
  ]);
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  address = this.googleService.address;

  signUpForm = new FormGroup({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
    firstName: this.firstName,
    lastName: this.lastName,
    address: this.address,
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public googleService: GoogleService
  ) {
    this.signUpForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
    });
  }

  ngOnInit(): void {}

  async signUp() {
    if (this.signUpForm.valid) {
      if (
        this.email.value &&
        this.password.value &&
        this.firstName.value &&
        this.lastName.value &&
        this.address.value
      ) {
        const latLng = await this.googleService.getLatLng(this.address.value);
        const user: User = {
          uid: '',
          email: this.email.value,
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          address: this.googleService.name,
          city: this.googleService.city,
          postal_code: this.googleService.postal_code,
          lat: latLng.lat,
          lng: latLng.lng,
          isPrestatary: false,
          geohash: '',
        };
        this.authService.SignUp(user, this.password.value);
      }
    } else {
      this.errorMessage = this.signUpForm.getError('message');
    }
  }
}
