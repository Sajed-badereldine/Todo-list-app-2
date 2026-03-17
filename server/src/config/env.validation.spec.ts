import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('returns the validated config when required values exist', () => {
    expect(
      validateEnv({
        PORT: '3000',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USERNAME: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'todo_app',
        JWT_SECRET: 'secret',
        JWT_EXPIRES_IN: '1d',
      }),
    ).toMatchObject({
      PORT: '3000',
      DATABASE_PORT: '5432',
    });
  });

  it('throws when required values are missing', () => {
    expect(() =>
      validateEnv({
        PORT: '3000',
      }),
    ).toThrow('Missing required environment variables');
  });
});
