import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../features/auth/components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';
import styles from './AuthPage.module.css';

function RegisterPage() {
  const { register, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (values) => {
    setServerError('');

    try {
      await register(values);
      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created. You can sign in now.',
        },
      });
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    }
  };

  return (
    <main className={styles.page}>
      <AuthForm
        mode="register"
        title="Create your Tasklane account"
        subtitle="Set up a simple, focused workspace in under a minute."
        submitLabel="Register"
        onSubmit={handleSubmit}
        isSubmitting={isAuthLoading}
        serverError={serverError}
      />

      <p className={styles.footerText}>
        Already have an account? <Link to="/login">Login instead</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
