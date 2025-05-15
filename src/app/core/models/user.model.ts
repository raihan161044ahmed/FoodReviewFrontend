// src/app/core/models/user.model.ts
export interface RegisterUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  role: string;
  token?: string;
  message?: string;
}
