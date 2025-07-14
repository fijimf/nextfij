export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  result: string;
  message: string;
  data: {
    token: string;
  } | null;
}

export interface User {
  username: string;
  // Add any other user fields if needed
} 