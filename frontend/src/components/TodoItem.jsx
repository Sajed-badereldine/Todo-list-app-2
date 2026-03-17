import { useState } from 'react';
import TodoForm from './TodoForm';
import styles from '../features/todos/components/TodoItem.module.css';
import { formatDate } from '../utils/formatDate';

function TodoItem({
  todo,
  isBusy,
  canMoveUp,
  canMoveDown,
  onToggle,
  onDelete,
  onUpdate,
  onReorder,
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <article className={styles.card}>
        <TodoForm
          initialValues={todo}
          submitLabel="Save changes"
          isSubmitting={isBusy}
          onCancel={() => setIsEditing(false)}
          onSubmit={async (values) => {
            await onUpdate(todo.id, values);
            setIsEditing(false);
          }}
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
          onClick={() => onToggle(todo.id)}
          disabled={isBusy}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed ? 'Undone' : 'Done'}
        </button>

        <span className={styles.meta}>Updated {formatDate(todo.updatedAt)}</span>
      </div>

      <div className={styles.content}>
        <h3 className={todo.completed ? styles.completedTitle : ''}>{todo.title}</h3>
        <p>{todo.description || 'No description provided.'}</p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.linkButton}
          type="button"
          onClick={() => onReorder(todo.id, 'up')}
          disabled={!canMoveUp || isBusy}
        >
          Move up
        </button>
        <button
          className={styles.linkButton}
          type="button"
          onClick={() => onReorder(todo.id, 'down')}
          disabled={!canMoveDown || isBusy}
        >
          Move down
        </button>
        <button
          className={styles.linkButton}
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isBusy}
        >
          Edit
        </button>
        <button
          className={styles.deleteButton}
          type="button"
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
