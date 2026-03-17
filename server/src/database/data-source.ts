import 'dotenv/config';
import { DataSource } from 'typeorm';
import { validateEnv } from '../config/env.validation';
import { User } from '../users/entities/user.entity';
import { Todo } from '../todos/entities/todo.entity';

validateEnv(process.env);

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Todo],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
