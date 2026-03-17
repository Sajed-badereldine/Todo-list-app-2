import { useEffect, useState } from 'react';
import styles from './TodoForm.module.css';

const blankTodo = {
  title: '',
  description: '',
};

function TodoForm({
  mode = 'create',
  initialValues = blankTodo,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError('A title is required.');
      return;
    }

    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() ? values.description.trim() : null,
    });

    if (mode === 'create') {
      setValues(blankTodo);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div>
          <h2>{mode === 'create' ? 'Capture the next thing' : 'Refine the details'}</h2>
          <p>
            {mode === 'create'
              ? 'Keep the list moving with a clear, focused task.'
              : 'Update the task without losing context.'}
          </p>
        </div>
      </div>

      <label className={styles.field}>
        <span>Title</span>
        <input
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="Prepare sprint review notes"
          maxLength={150}
        />
      </label>

      <label className={styles.field}>
        <span>Description</span>
        <textarea
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          placeholder="Anything useful for future-you goes here."
          rows="4"
          maxLength={2000}
        />
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className={styles.secondaryButton} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default TodoForm;
