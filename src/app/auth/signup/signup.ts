import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  fullName = '';
  email = '';
  phone = '';
  specialization = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  agreeTerms = false;
  errorMessage = '';

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSignup() {
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }
    if (!this.agreeTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions.';
      return;
    }
    this.errorMessage = '';
    this.router.navigate(['/login']);
  }
}
