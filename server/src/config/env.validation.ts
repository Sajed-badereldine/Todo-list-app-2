type EnvConfig = Record<string, string | undefined>;

const requiredEnvVars = [
  'PORT',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASS',
  'MAIL_FROM',
  'CLIENT_URL',
] as const;

export function validateEnv(config: EnvConfig) {
  const missing = requiredEnvVars.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const port = Number(config.PORT);
  const databasePort = Number(config.DATABASE_PORT);
  const mailPort = Number(config.MAIL_PORT);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error('PORT must be a valid positive number');
  }

  if (Number.isNaN(databasePort) || databasePort <= 0) {
    throw new Error('DATABASE_PORT must be a valid positive number');
  }

  if (Number.isNaN(mailPort) || mailPort <= 0) {
    throw new Error('MAIL_PORT must be a valid positive number');
  }

  return {
    ...config,
    PORT: String(port),
    DATABASE_PORT: String(databasePort),
    MAIL_PORT: String(mailPort),
  };
}
