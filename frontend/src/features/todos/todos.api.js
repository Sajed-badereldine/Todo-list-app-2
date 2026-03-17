import apiClient from '../../services/api/client';

export async function getTodos(filter = 'all') {
  const params = {};

  if (filter === 'completed') {
    params.completed = true;
  }

  if (filter === 'active') {
    params.completed = false;
  }

  const { data } = await apiClient.get('/todos', { params });
  return data;
}

export async function getTodoById(id) {
  const { data } = await apiClient.get(`/todos/${id}`);
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
