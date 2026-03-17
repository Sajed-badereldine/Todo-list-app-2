import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './AuthPage.module.css';
import panelStyles from './AuthActionPage.module.css';
import { resendVerificationEmail } from '../services/authService';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import { clearPendingVerificationEmail, getPendingVerificationEmail, setPendingVerificationEmail } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';

function PleaseVerifyPage() {
  const location = useLocation();
  const { user } = useAuth();
  const [email, setEmail] = useState(location.state?.email || getPendingVerificationEmail() || '');
  const [message, setMessage] = useState(location.state?.message || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setPendingVerificationEmail(location.state.email);
    }
  }, [location.state?.email]);

  useEffect(() => {
    if (user?.isEmailVerified) {
      clearPendingVerificationEmail();
      setMessage('Your email is already verified. You can log in now.');
      setErrorMessage('');
    }
  }, [user?.isEmailVerified]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await resendVerificationEmail({ email });
      setPendingVerificationEmail(email);
      setMessage(response.message);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to resend the verification email.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.isEmailVerified) {
    return (
      <main className={styles.page}>
        <div className={panelStyles.wrapper}>
          <div className={panelStyles.card}>
            <span className={panelStyles.eyebrow}>Success</span>
            <h1 className={panelStyles.title}>Your email is verified.</h1>
            <p className={panelStyles.description}>
              Your account is ready. You can log in normally now.
            </p>

            {message ? <div className={`${panelStyles.message} ${panelStyles.success}`}>{message}</div> : null}

            <div className={panelStyles.actions}>
              <Link className={panelStyles.button} to="/login">
                Go to login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={panelStyles.wrapper}>
        <div className={panelStyles.card}>
          <span className={panelStyles.eyebrow}>Almost there</span>
          <h1 className={panelStyles.title}>Verify your email to unlock login.</h1>
          <p className={panelStyles.description}>
            We sent a verification link after signup. Once you confirm your email, you can log in and use the app normally.
          </p>

          {message ? <div className={`${panelStyles.message} ${panelStyles.success}`}>{message}</div> : null}
          {errorMessage ? <div className={`${panelStyles.message} ${panelStyles.error}`}>{errorMessage}</div> : null}

          <form className={panelStyles.form} onSubmit={handleSubmit}>
            <label className={panelStyles.field}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@example.com"
                required
              />
            </label>

            <div className={panelStyles.actions}>
              <button className={panelStyles.button} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Resend verification email'}
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

export default PleaseVerifyPage;
