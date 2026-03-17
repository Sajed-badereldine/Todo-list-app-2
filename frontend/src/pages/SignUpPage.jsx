import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import { setPendingVerificationEmail } from '../utils/storage';
import styles from './AuthPage.module.css';

function SignUpPage() {
  const navigate = useNavigate();
  const { signup, isAuthLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values) => {
    setErrorMessage('');

    try {
      await signup(values);
      setPendingVerificationEmail(values.email);
      navigate('/please-verify', {
        replace: true,
        state: {
          email: values.email,
          message: 'Account created successfully. Check your inbox to verify your email before logging in.',
        },
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to create your account.'));
    }
  };

  return (
    <main className={styles.page}>
      <AuthForm mode="signup" onSubmit={handleSubmit} isSubmitting={isAuthLoading} errorMessage={errorMessage} />
      <p className={styles.footerText}>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}

export default SignUpPage;
