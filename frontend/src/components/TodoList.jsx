import EmptyState from './EmptyState';
import TodoItem from './TodoItem';
import styles from '../features/todos/components/TodoList.module.css';

function TodoList({ todos, busyTodoId, onToggle, onDelete, onUpdate, onReorder }) {
  if (!todos.length) {
    return (
      <EmptyState
        title="No tasks in this view"
        description="Add a new todo to get momentum back."
      />
    );
  }

  return (
    <div className={styles.grid}>
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isBusy={busyTodoId === todo.id}
          canMoveUp={index > 0}
          canMoveDown={index < todos.length - 1}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}

export default TodoList;
