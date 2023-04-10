import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private graphqlService: GraphqlService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;

      // Call login method
      this.graphqlService.login(email, password).subscribe(
        (response) => {
          // Handle successful login
          console.log('Login successful:', response);
          this.router.navigate(['/employee-list']);
        },
        (error) => {
          // Handle login error
          console.log('Login error:', error);
          this.errorMessage = 'Invalid email or password';
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  closeErrorModal(): void {
    this.errorMessage = '';
  }
}
