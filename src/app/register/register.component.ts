import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { email, username, password } = this.registerForm.value;

      // Check if a user already exists in localStorage
      const existingUser = JSON.parse(localStorage.getItem('user') || 'null');

      if (existingUser && existingUser.email === email) {
        alert('Email is already registered. Please login.');
      } else {
        // Save new user to localStorage
        const newUser = { email, username, password, role: 'User' };
        localStorage.setItem('user', JSON.stringify(newUser));

        alert('Registration successful! You can now login.');
        this.registerForm.reset();

        // Navigate to login page
        this.router.navigateByUrl('/login');
      }
    } else {
      alert('Please fill in all fields correctly.');
    }
  }
}
