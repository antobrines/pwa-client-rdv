import { Component } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  errorMessage = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  signInForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.signInForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  login() {
    if (this.signInForm.valid) {
      if (this.email.value && this.password.value)
        this.authService.SignIn(this.email.value, this.password.value);
    } else {
      this.errorMessage = 'Please fill the form correctly';
    }
  }
}
