import styles from './LoadingSpinner.module.css';

function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  return (
    <div className={fullScreen ? styles.fullScreen : styles.inline} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
