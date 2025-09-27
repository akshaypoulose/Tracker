import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Initialize mock user
    if (!localStorage.getItem('user')) {
      const mockUser = {
        email: 'user@test.com',
       
        password: '123456',
        role: 'User',
        username: 'Akshay Poulose'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
    }
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const storedUser = JSON.parse(localStorage.getItem('user')!);

      if (storedUser && email === storedUser.email && password === storedUser.password) {
        alert(`Welcome ${storedUser.name}!`);
        localStorage.setItem('token', 'mock-token');
        this.router.navigateByUrl('/home');
      } else {
        alert('Invalid email or password');
      }

      this.loginForm.reset();
    } else {
      alert('Please fill in the form correctly');
    }
  }
}
