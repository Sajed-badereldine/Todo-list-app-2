import { useState } from 'react';
import styles from '../features/auth/components/AuthForm.module.css';

const initialState = {
  name: '',
  email: '',
  password: '',
};

function AuthForm({ mode, onSubmit, isSubmitting, errorMessage, successMessage }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);

    if (mode === 'signup') {
      setForm(initialState);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{mode === 'signup' ? 'Start fresh' : 'Welcome back'}</span>
          <h1>{mode === 'signup' ? 'Start managing your todos cleanly.' : 'Log in to your Todo workspace.'}</h1>
          <p>
          </p>
        </div>

        <StatusBanner type="success" message={successMessage} />
        <StatusBanner type="error" message={errorMessage} />

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label className={styles.field}>
              <span>Name</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusBanner({ type, message }) {
  if (!message) {
    return null;
  }

  return <div className={type === 'error' ? styles.errorBanner : styles.successBanner}>{message}</div>;
}

export default AuthForm;
