import styles from './StatusBanner.module.css';

function StatusBanner({ type = 'info', message }) {
  if (!message) {
    return null;
  }

  const bannerTypeClass =
    type === 'error' ? styles.error : type === 'success' ? styles.success : styles.info;

  return <div className={`${styles.banner} ${bannerTypeClass}`}>{message}</div>;
}

export default StatusBanner;
