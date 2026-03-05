import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  
  registerData: RegisterRequest = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirm_password: '',
    occupation: '',
    monthly_income: undefined
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 400 && err.error?.detail) {
          this.error = err.error.detail;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    });
  }

  private validateForm(): boolean {
    if (!this.registerData.email || !this.registerData.password || !this.registerData.confirm_password) {
      this.error = 'Please fill in all required fields';
      return false;
    }

    if (this.registerData.password !== this.registerData.confirm_password) {
      this.error = 'Passwords do not match';
      return false;
    }

    if (this.registerData.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.error = 'Please enter a valid email address';
      return false;
    }

    return true;
  }
}
