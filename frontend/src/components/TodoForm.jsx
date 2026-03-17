import { useEffect, useState } from 'react';
import styles from '../features/todos/components/TodoForm.module.css';

const emptyForm = {
  title: '',
  description: '',
};

function TodoForm({ onSubmit, isSubmitting, initialValues, submitLabel, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(
      initialValues
        ? {
            title: initialValues.title || '',
            description: initialValues.description || '',
          }
        : emptyForm,
    );
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
    });

    if (!initialValues) {
      setForm(emptyForm);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div>
          <h2>{initialValues ? 'Refine the details' : 'Capture the next thing'}</h2>
          <p>
            {initialValues
              ? 'Update the task without losing context.'
              : 'Keep the list moving with a clear, focused task.'}
          </p>
        </div>
      </div>

      <label className={styles.field}>
        <span>Title</span>
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Add a todo title"
          maxLength={150}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details"
          rows="4"
          maxLength={2000}
          style={{resize:'none'}}
        />
      </label>

      <div className={styles.actions}>
        <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel ? (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default TodoForm;
