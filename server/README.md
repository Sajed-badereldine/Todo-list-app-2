# Todo REST API

Production-leaning Todo REST API built with NestJS, PostgreSQL, TypeORM migrations, JWT auth, bcrypt password hashing, DTO validation, and Swagger.

## Stack

- NestJS 11
- PostgreSQL
- TypeORM 0.3 migrations
- JWT bearer auth with Passport
- `bcrypt` password hashing
- `class-validator` and `class-transformer`
- Swagger at `/docs`

## Project Structure

```text
src/
  app.module.ts
  config/
    env.validation.ts
  database/
    data-source.ts
    migrations/
    seed.ts
    typeorm.config.ts
  users/
    dto/
    entities/
    users.module.ts
    users.service.ts
    users.controller.ts
  auth/
    dto/
    guards/
    strategies/
    auth.module.ts
    auth.service.ts
    auth.controller.ts
  todos/
    dto/
    entities/
    todos.module.ts
    todos.service.ts
    todos.controller.ts
  common/
    decorators/
    interfaces/
```

## Install

```bash
npm install
```

If you are starting from the original scaffold and want the updated dependencies explicitly:

```bash
npm install @nestjs/config @nestjs/swagger swagger-ui-express dotenv
```

## Environment

Create `.env` from `.env.example` and update the values:

```bash
cp .env.example .env
```

## Database

1. Create a PostgreSQL database named `todo_app` or any name matching `DATABASE_NAME`.
2. Ensure the `uuid-ossp` extension can be created by your database user.
3. Run migrations:

```bash
npm run migration:run
```

## Start

```bash
npm run start:dev
```

Swagger docs will be available at `http://localhost:3000/docs`.

## Migration Commands

```bash
npm run migration:create
npm run migration:generate
npm run migration:run
npm run migration:revert
```

## Seed Demo Data

```bash
npm run seed
```

Demo credentials:

- Email: `demo@example.com`
- Password: `Password123!`

## Sample Requests

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"Password123!\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"jane@example.com\",\"password\":\"Password123!\"}"
```

### Create Todo

```bash
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Ship API\",\"description\":\"Use JWT auth and migrations\"}"
```

### List Todos

```bash
curl http://localhost:3000/todos?completed=false \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Update Todo

```bash
curl -X PATCH http://localhost:3000/todos/<TODO_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"completed\":true}"
```

### Delete Todo

```bash
curl -X DELETE http://localhost:3000/todos/<TODO_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```
