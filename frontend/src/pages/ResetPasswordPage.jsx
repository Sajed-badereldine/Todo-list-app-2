import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import styles from './AuthPage.module.css';
import panelStyles from './AuthActionPage.module.css';
import { resetPassword } from '../services/authService';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(token ? '' : 'The reset link is missing a token.');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!token) {
      setErrorMessage('The reset link is missing a token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token,
        newPassword,
      });

      setSuccessMessage(response.message);
      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: {
            message: 'Password updated successfully. Log in with your new password.',
          },
        });
      }, 1200);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to reset your password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={panelStyles.wrapper}>
        <div className={panelStyles.card}>
          <span className={panelStyles.eyebrow}>Secure reset</span>
          <h1 className={panelStyles.title}>Choose a new password</h1>
          <p className={panelStyles.description}>
            Create a fresh password for your account. This link works only once and expires after one hour.
          </p>

          {successMessage ? <div className={`${panelStyles.message} ${panelStyles.success}`}>{successMessage}</div> : null}
          {errorMessage ? <div className={`${panelStyles.message} ${panelStyles.error}`}>{errorMessage}</div> : null}

          <form className={panelStyles.form} onSubmit={handleSubmit}>
            <label className={panelStyles.field}>
              <span>New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="NewPassword123!"
                required
              />
            </label>

            <label className={panelStyles.field}>
              <span>Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </label>

            <div className={panelStyles.actions}>
              <button className={panelStyles.button} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Reset password'}
              </button>
              <Link className={panelStyles.secondaryButton} to="/forgot-password">
                Request a new link
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
