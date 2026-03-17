import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './AuthPage.module.css';
import panelStyles from './AuthActionPage.module.css';
import { verifyEmailToken } from '../services/authService';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import { clearPendingVerificationEmail } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, refreshCurrentUser } = useAuth();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState(token ? 'loading' : 'error');
  const [message, setMessage] = useState(
    token ? 'We are verifying your email now.' : 'The verification link is missing a token.',
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    async function runVerification() {
      try {
        const response = await verifyEmailToken(token);

        clearPendingVerificationEmail();
        sessionStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('pendingVerificationEmail');
        sessionStorage.removeItem('pendingUser');
        localStorage.removeItem('pendingUser');
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');

        if (isAuthenticated) {
          await refreshCurrentUser();
        }

        if (!isMounted) {
          return;
        }

        setStatus('success');
        setMessage(response.message || 'Email verified successfully.');

        setTimeout(() => {
          navigate('/please-verify', {
            replace: true,
            state: {
              verified: true,
              email: '',
              message: 'Email verified successfully. You can log in now.',
            },
          });
        }, 1500);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus('error');
        setMessage(getApiErrorMessage(error, 'Unable to verify your email.'));
      }
    }

    void runVerification();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, navigate, refreshCurrentUser, token]);

  return (
    <main className={styles.page}>
      <div className={panelStyles.wrapper}>
        <div className={panelStyles.card}>
          <span className={panelStyles.eyebrow}>Email status</span>
          <h1 className={panelStyles.title}>Verification result</h1>
            <p className={panelStyles.description}>
              {status === 'loading'
                ? 'This usually takes a moment.'
                : status === 'success'
                  ? 'Your email has been verified successfully. You can continue to login.'
                  : 'If the link expired, you can request a fresh verification email.'}
            </p>

            <div
              className={`${panelStyles.message} ${status === 'success' ? panelStyles.success : panelStyles.error}`}
            >
              {message}
            </div>

            <div className={panelStyles.actions}>
              {status === 'success' ? (
                <Link
                  className={panelStyles.button}
                  to="/login"
                  state={{ message: 'Email verified successfully. You can log in now.' }}
                >
                  Go to login
                </Link>
              ) : null}

              {status === 'error' ? (
                <Link className={panelStyles.secondaryButton} to="/please-verify">
                  Resend verification
                </Link>
              ) : null}
            </div>
        </div>
      </div>
    </main>
  );
}

export default VerifyEmailPage;
