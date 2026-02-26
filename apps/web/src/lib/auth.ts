import { api } from './api';

interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'creator' | 'fan';
}

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      displayName: string;
      role: string;
      avatar: string | null;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
  return data;
}

export async function getMeApi() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logoutApi() {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
