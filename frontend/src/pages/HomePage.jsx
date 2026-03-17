import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './HomePage.module.css';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Modern task flow</span>
          <h1>A todo dashboard that feels calm even on busy days.</h1>
          <p>
            Tasklane connects to your NestJS API, keeps sessions alive with JWT auth, and gives
            you a clean, responsive workspace for planning, editing, and finishing tasks.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} to={isAuthenticated ? '/todos' : '/register'}>
              {isAuthenticated ? 'Open dashboard' : 'Create account'}
            </Link>
            <Link className={styles.secondaryButton} to={isAuthenticated ? '/todos' : '/login'}>
              {isAuthenticated ? 'Review todos' : 'Sign in'}
            </Link>
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <strong>Today at a glance</strong>
            <span>3 active lanes</span>
          </div>
          <div className={styles.previewList}>
            <article>
              <div>
                <h3>Release checklist</h3>
                <p>Docs, QA, and deployment notes lined up.</p>
              </div>
              <span>Done</span>
            </article>
            <article>
              <div>
                <h3>Design review follow-up</h3>
                <p>Turn notes into action items before lunch.</p>
              </div>
              <span>Open</span>
            </article>
            <article>
              <div>
                <h3>Backlog cleanup</h3>
                <p>Trim old ideas and keep the board useful.</p>
              </div>
              <span>Open</span>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
