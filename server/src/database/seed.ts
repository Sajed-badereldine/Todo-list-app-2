import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from './data-source';
import { User } from '../users/entities/user.entity';
import { Todo } from '../todos/entities/todo.entity';

async function seed() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const todoRepository = dataSource.getRepository(Todo);

  const existingUser = await userRepository.findOne({
    where: { email: 'demo@example.com' },
  });

  let user = existingUser;

  if (!user) {
    user = userRepository.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: await bcrypt.hash('Password123!', 10),
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    user = await userRepository.save(user);
  } else if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user = await userRepository.save(user);
  }

  const todoCount = await todoRepository.count({
    where: { userId: user.id },
  });

  if (todoCount === 0) {
    const todos = todoRepository.create([
      {
        title: 'Set up NestJS Todo API',
        description: 'Verify auth, migrations, and PostgreSQL config.',
        completed: true,
        userId: user.id,
      },
      {
        title: 'Review Swagger docs',
        description: 'Open /docs and validate secured routes.',
        completed: false,
        userId: user.id,
      },
      {
        title: 'Create a new todo from Postman',
        description: null,
        completed: false,
        userId: user.id,
      },
    ]);

    await todoRepository.save(todos);
  }

  await dataSource.destroy();
  console.log('Seed completed. Demo user: demo@example.com / Password123!');
}

void seed();
