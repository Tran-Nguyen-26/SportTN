export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  totalPoints: number;
  provider: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userResponse: UserResponse;
}


export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface OAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
