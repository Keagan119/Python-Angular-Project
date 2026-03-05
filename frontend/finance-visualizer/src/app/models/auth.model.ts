export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  email: string;
}

export interface RegisterRequest {
  name?: string;
  surname?: string;
  email: string;
  password: string;
  confirm_password: string;
  occupation?: string;
  monthly_income?: number;
}
