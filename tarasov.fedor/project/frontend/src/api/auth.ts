import type { AuthResponse, User } from '../types';
import { apiRequest } from './client';

export function loginRequest(
  username: string,
  password: string,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logoutRequest(): Promise<void> {
  await apiRequest<{ message: string }>('/logout', {
    method: 'POST',
  });
}

export function getCurrentUserRequest(): Promise<{ user: User }> {
  return apiRequest<{ user: User }>('/me');
}
