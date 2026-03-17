import apiClient from './api/client';

export async function getTodos() {
  const { data } = await apiClient.get('/todos');
  return data;
}

export async function createTodo(payload) {
  const { data } = await apiClient.post('/todos', payload);
  return data;
}

export async function updateTodo(id, payload) {
  const { data } = await apiClient.patch(`/todos/${id}`, payload);
  return data;
}

export async function deleteTodo(id) {
  const { data } = await apiClient.delete(`/todos/${id}`);
  return data;
}

export async function toggleTodo(id) {
  const { data } = await apiClient.patch(`/todos/${id}/toggle`);
  return data;
}

export async function reorderTodo(id, direction) {
  const { data } = await apiClient.patch(`/todos/${id}/reorder`, { direction });
  return data;
}
