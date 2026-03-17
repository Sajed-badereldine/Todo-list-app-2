import apiClient from '../../services/api/client';

export async function registerUser(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/users/me');
  return data;
}
