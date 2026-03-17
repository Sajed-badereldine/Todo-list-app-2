import { Link } from 'react-router-dom';
import { useState } from 'react';
import TodoForm from './TodoForm';
import styles from './TodoItem.module.css';
import { formatDate } from '../../../utils/formatDate';

function TodoItem({ todo, onToggle, onUpdate, onDelete, isBusy }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <article className={styles.card}>
        <TodoForm
          mode="edit"
          initialValues={{
            title: todo.title,
            description: todo.description || '',
          }}
          isSubmitting={isBusy}
          submitLabel="Save changes"
          onSubmit={async (values) => {
            await onUpdate(todo.id, values);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <button
          type="button"
          className={`${styles.toggle} ${todo.completed ? styles.completed : ''}`}
          onClick={() => onToggle(todo)}
          disabled={isBusy}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? 'Done' : 'Open'}
        </button>

        <span className={styles.meta}>Updated {formatDate(todo.updatedAt)}</span>
      </div>

      <div className={styles.content}>
        <h3 className={todo.completed ? styles.completedTitle : ''}>{todo.title}</h3>
        <p>{todo.description || 'No extra notes yet.'}</p>
      </div>

      <div className={styles.actions}>
        <Link className={styles.linkButton} to={`/todos/${todo.id}`}>
          View
        </Link>
        <button type="button" className={styles.linkButton} onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(todo.id)}
          disabled={isBusy}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TodoItem;
