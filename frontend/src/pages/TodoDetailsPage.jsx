import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBanner from '../components/StatusBanner';
import TodoForm from '../features/todos/components/TodoForm';
import { deleteTodo, getTodoById, updateTodo } from '../features/todos/todos.api';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import { formatDate } from '../utils/formatDate';
import styles from './TodoDetailsPage.module.css';

function TodoDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadTodo() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getTodoById(id);
        setTodo(data);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, 'Unable to load this todo.'));
      } finally {
        setIsLoading(false);
      }
    }

    void loadTodo();
  }, [id]);

  const handleSave = async (values) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const updatedTodo = await updateTodo(id, values);
      setTodo(updatedTodo);
      setMessage('Todo updated successfully.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to save changes.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm('Delete this todo?');

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteTodo(id);
      navigate('/todos', {
        replace: true,
        state: { message: 'Todo deleted.' },
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to delete this todo.'));
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading todo details..." />;
  }

  if (!todo) {
    return (
      <main className={styles.page}>
        <StatusBanner type="error" message={errorMessage || 'Todo not found.'} />
        <Link className={styles.backLink} to="/todos">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link className={styles.backLink} to="/todos">
            Back to dashboard
          </Link>
          <h1>{todo.title}</h1>
          <p>Created {formatDate(todo.createdAt)}</p>
        </div>
        <button type="button" className={styles.deleteButton} onClick={handleDelete}>
          Delete todo
        </button>
      </div>

      <StatusBanner type="error" message={errorMessage} />
      <StatusBanner type="success" message={message} />

      <TodoForm
        mode="edit"
        initialValues={{
          title: todo.title,
          description: todo.description || '',
        }}
        onSubmit={handleSave}
        isSubmitting={isSaving}
        submitLabel="Save changes"
      />
    </main>
  );
}

export default TodoDetailsPage;
