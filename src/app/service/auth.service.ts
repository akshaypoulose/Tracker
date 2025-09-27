import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'users';          // Store all registered users
  private currentUserKey = 'currentUser'; // Store logged-in user

  constructor() {}

  // Register a new user
  register(user: { name: string; email: string; password: string }) {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    // Optional: prevent duplicate email
    if (users.find((u: any) => u.email === user.email)) {
      throw new Error('Email already exists');
    }

    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // Login
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return true;
    }

    return false;
  }

  // Logout
  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  // Get current logged-in user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
  }

  // Check if a user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }
}
