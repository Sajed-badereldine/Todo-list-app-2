import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>T</span>
          <div>
            <strong>Tasklane</strong>
            <small>Sharp focus, lighter list.</small>
          </div>
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <div className={styles.userPill}>{user?.name || user?.email}</div>
              <button type="button" className={styles.primaryButton} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={styles.linkButton} to="/login">
                Login
              </Link>
              <Link className={styles.primaryButton} to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
