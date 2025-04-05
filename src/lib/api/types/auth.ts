export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // Add any other fields from the API response if needed
}

export interface User {
  username: string;
  // Add any other user fields if needed
} 