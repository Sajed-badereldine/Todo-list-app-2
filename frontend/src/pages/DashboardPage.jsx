import { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBanner from '../components/StatusBanner';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import {
  createTodo,
  deleteTodo,
  getTodos,
  reorderTodo,
  toggleTodo,
  updateTodo,
} from '../services/todoService';
import styles from './TodosPage.module.css';

function DashboardPage() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [busyTodoId, setBusyTodoId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState({ error: '', success: '' });

  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

  const loadTodos = async () => {
    setIsLoading(true);
    setStatus({ error: '', success: '' });

    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      setStatus({ error: getApiErrorMessage(error, 'Unable to load todos.'), success: '' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTodos();
  }, []);

  const handleCreate = async (values) => {
    setIsCreating(true);
    setStatus({ error: '', success: '' });

    try {
      const createdTodo = await createTodo(values);
      setTodos((current) => [...current, createdTodo].sort((a, b) => a.position - b.position));
      setStatus({ error: '', success: 'Todo created successfully.' });
    } catch (error) {
      setStatus({ error: getApiErrorMessage(error, 'Unable to create todo.'), success: '' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id, values) => {
    setBusyTodoId(id);
    setStatus({ error: '', success: '' });

    try {
      const updated = await updateTodo(id, values);
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)));
      setStatus({ error: '', success: 'Todo updated successfully.' });
    } catch (error) {
      setStatus({ error: getApiErrorMessage(error, 'Unable to update todo.'), success: '' });
    } finally {
      setBusyTodoId('');
    }
  };

  const handleDelete = async (id) => {
    setBusyTodoId(id);
    setStatus({ error: '', success: '' });

    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id).map((todo, index) => ({ ...todo, position: index })));
      setStatus({ error: '', success: 'Todo deleted successfully.' });
    } catch (error) {
      setStatus({ error: getApiErrorMessage(error, 'Unable to delete todo.'), success: '' });
    } finally {
      setBusyTodoId('');
    }
  };

  const handleToggle = async (id) => {
    setBusyTodoId(id);
    setStatus({ error: '', success: '' });

    try {
      const updated = await toggleTodo(id);
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)));
      setStatus({
        error: '',
        success: updated.completed ? 'Todo marked complete.' : 'Todo marked incomplete.',
      });
    } catch (error) {
      setStatus({ error: getApiErrorMessage(error, 'Unable to change status.'), success: '' });
    } finally {
      setBusyTodoId('');
    }
  };

  const handleReorder = async (id, direction) => {
    setBusyTodoId(id);
    setStatus({ error: '', success: '' });

    try {
      await reorderTodo(id, direction);
      const data = await getTodos();
      setTodos(data);
      setStatus({ error: '', success: `Todo moved ${direction}.` });
    } catch (error) {
      setStatus({ error: getApiErrorMessage(error, 'Unable to reorder todo.'), success: '' });
    } finally {
      setBusyTodoId('');
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Todo dashboard</span>
          <h1>{user ? `${user.name}'s tasks` : 'Your tasks'}</h1>
        </div>

        <div className={styles.stats}>
          <article>
            <strong>{todos.length}</strong>
            <span>visible tasks</span>
          </article>
          <article>
            <strong>{completedCount}</strong>
            <span>completed here</span>
          </article>
        </div>
      </section>

      <section className={styles.layout}>
        <div className={styles.sidebar}>
          <TodoForm onSubmit={handleCreate} isSubmitting={isCreating} submitLabel="Add todo" />
        </div>

        <div className={styles.content}>
          <div className={styles.toolbar}>
          </div>

          <StatusBanner type="error" message={status.error} />
          <StatusBanner type="success" message={status.success} />

          {isLoading ? (
            <LoadingSpinner label="Loading todos..." />
          ) : (
            <TodoList
              todos={todos}
              busyTodoId={busyTodoId}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onReorder={handleReorder}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
