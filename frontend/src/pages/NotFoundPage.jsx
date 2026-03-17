import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span>404</span>
        <h1>That page drifted off the board.</h1>
        <p>The link may be old, or the page may have moved.</p>
        <Link to="/" className={styles.link}>
          Go home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
