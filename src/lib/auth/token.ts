import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  // Add any other claims your token might have
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    return decoded.exp < currentTime;
  } catch {
    // If token is invalid or can't be decoded, consider it expired
    return true;
  }
}

export function getTokenExpirationTime(token: string): Date | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return new Date(decoded.exp * 1000); // Convert seconds to milliseconds
  } catch {
    return null;
  }
} 