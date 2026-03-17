import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import { clearPendingVerificationEmail } from '../utils/storage';
import styles from './AuthPage.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';
  const successMessage = location.state?.message || '';

  const handleSubmit = async (values) => {
    setErrorMessage('');

    try {
      await login({
        email: values.email,
        password: values.password,
      });
      clearPendingVerificationEmail();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to log in.'));
    }
  };

  return (
    <main className={styles.page}>
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        isSubmitting={isAuthLoading}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
      <p className={styles.footerText}>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
      <p className={styles.footerText}>
        Forgot your password? <Link to="/forgot-password">Reset it here</Link>
      </p>
      <p className={styles.footerText}>
        Need a new verification email? <Link to="/please-verify">Resend verification</Link>
      </p>
    </main>
  );
}

export default LoginPage;
