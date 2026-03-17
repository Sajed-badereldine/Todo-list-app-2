import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './AuthPage.module.css';
import panelStyles from './AuthActionPage.module.css';
import { forgotPassword } from '../services/authService';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to start the password reset flow.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={panelStyles.wrapper}>
        <div className={panelStyles.card}>
          <span className={panelStyles.eyebrow}>Password help</span>
          <h1 className={panelStyles.title}>Request a reset link</h1>
          <p className={panelStyles.description}>
            Enter your email address and we will send reset instructions if an account exists.
          </p>

          {message ? <div className={`${panelStyles.message} ${panelStyles.success}`}>{message}</div> : null}
          {errorMessage ? <div className={`${panelStyles.message} ${panelStyles.error}`}>{errorMessage}</div> : null}

          <form className={panelStyles.form} onSubmit={handleSubmit}>
            <label className={panelStyles.field}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                required
              />
            </label>

            <div className={panelStyles.actions}>
              <button className={panelStyles.button} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
              <Link className={panelStyles.secondaryButton} to="/login">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
