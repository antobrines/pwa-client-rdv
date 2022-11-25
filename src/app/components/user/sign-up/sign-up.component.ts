import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  errorMessages = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  // formcontrol for firstName, lastName, address, city, state
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  state = new FormControl('', [Validators.required]);

  signUpForm = new FormGroup({
    email: this.email,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
    address: this.address,
    city: this.city,
    state: this.state,
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.signUpForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      state: this.state,
    });
  }

  ngOnInit(): void {}

  signUp() {
    if (this.signUpForm.valid) {
      if (
        this.email.value &&
        this.password.value &&
        this.firstName.value &&
        this.lastName.value &&
        this.address.value &&
        this.city.value &&
        this.state.value
      ) {
        const user: User = {
          uid: '',
          email: this.email.value,
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          address: this.address.value,
          city: this.city.value,
          state: this.state.value,
          latitude: null,
          longitude: null,
          isPrestatary: false,
        };
        this.authService.SignUp(user, this.password.value);
      }
    } else {
      this.errorMessages = 'Please fill the form correctly';
    }
  }
}
