import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Todo } from '../todos/entities/todo.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Todo],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
