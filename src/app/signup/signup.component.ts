import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage = 'INVALID';

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        // confirmPassword: ['', Validators.required],
      },
      { validators: this.checkPasswords }
    );

    // Reset error message
    this.errorMessage = '';
  }

  ngOnInit(): void {}

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const username = this.signupForm.get('username')?.value;
      const email = this.signupForm.get('email')?.value;
      const password = this.signupForm.get('password')?.value;

      // Call createUser method
      this.graphqlService.createUser(username, email, password).subscribe(
        (response) => {
          // Handle successful user creation
          console.log('User created:', response);
        },
        (error) => {
          // Handle user creation error
          console.log('User creation error:', error);
          this.errorMessage = 'Failed to create user';
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
