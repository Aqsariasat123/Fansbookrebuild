import { api } from './api';

interface LoginPayload {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'creator' | 'fan';
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  avatar: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

interface LoginResponse {
  success: boolean;
  data: {
    requires2FA?: boolean;
    userId?: string;
    user?: AuthUser;
    accessToken?: string;
  };
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  if (data.data.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken);
  }
  return data;
}

export async function validate2FA(payload: {
  userId: string;
  code?: string;
  backupCode?: string;
  rememberMe?: boolean;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/2fa/validate', payload);
  localStorage.setItem('accessToken', data.data.accessToken);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  localStorage.setItem('accessToken', data.data.accessToken);
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
  }
}
