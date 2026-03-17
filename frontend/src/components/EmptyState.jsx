import styles from './EmptyState.module.css';

function EmptyState({ title = 'No todos yet', description = 'Create your first task to get started.' }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>+</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
