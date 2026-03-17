import apiClient from './api/client';

export async function signupUser(payload) {
  const { data } = await apiClient.post('/auth/signup', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function verifyEmailToken(token) {
  const { data } = await apiClient.get('/auth/verify-email', {
    params: { token },
  });
  return data;
}

export async function resendVerificationEmail(payload) {
  const { data } = await apiClient.post('/auth/resend-verification', payload);
  return data;
}

export async function forgotPassword(payload) {
  const { data } = await apiClient.post('/auth/forgot-password', payload);
  return data;
}

export async function resetPassword(payload) {
  const { data } = await apiClient.post('/auth/reset-password', payload);
  return data;
}
