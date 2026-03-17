import { useState } from 'react';
import styles from './AuthForm.module.css';

const initialValues = {
  name: '',
  email: '',
  password: '',
};

function getValidationErrors(mode, values) {
  const errors = {};

  if (mode === 'register' && values.name.trim().length < 2) {
    errors.name = 'Please enter at least 2 characters for your name.';
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/.test(values.password)
  ) {
    errors.password =
      'Password should include uppercase, lowercase, a number, and a special character.';
  }

  return errors;
}

function AuthForm({
  mode,
  title,
  subtitle,
  submitLabel,
  onSubmit,
  isSubmitting,
  serverError,
  successMessage,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = getValidationErrors(mode, values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit(values, () => {
      setValues(initialValues);
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{mode === 'login' ? 'Welcome back' : 'Start fresh'}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {serverError ? <div className={styles.errorBanner}>{serverError}</div> : null}
        {successMessage ? <div className={styles.successBanner}>{successMessage}</div> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label className={styles.field}>
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name ? <small>{errors.name}</small> : null}
            </label>
          ) : null}

          <label className={styles.field}>
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="Password123!"
              value={values.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {errors.password ? <small>{errors.password}</small> : null}
          </label>

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
