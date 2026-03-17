import EmptyState from '../../../components/EmptyState';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

function TodoList({ todos, onToggle, onUpdate, onDelete, busyTodoId }) {
  if (todos.length === 0) {
    return (
      <EmptyState
        title="No tasks in this view"
        description="Try a different filter or add a new todo to get momentum back."
      />
    );
  }

  return (
    <div className={styles.grid}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isBusy={busyTodoId === todo.id}
        />
      ))}
    </div>
  );
}

export default TodoList;
