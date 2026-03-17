# Tasklane Frontend

React + Vite frontend for the Todo API backend. It includes:

- Login and register pages
- JWT auth stored in `localStorage`
- Session restoration with `GET /users/me`
- Protected routes
- Todo dashboard with create, edit, delete, toggle, and filters
- Axios API client with automatic bearer token attachment
- Automatic logout on `401`
- Responsive UI, dark mode toggle, and beginner-friendly structure

## Install

```bash
cd frontend
npm install
```

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set the backend URL:

```env
VITE_API_URL=http://localhost:3000
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## End-to-End Verification

Install Playwright and the browser bundle:

```bash
cd frontend
npm install
npx playwright install
```

Create `.env.e2e` from `.env.e2e.example`:

```bash
cp .env.e2e.example .env.e2e
```

Required test environment values:

```env
FRONTEND_URL=http://127.0.0.1:5173
BACKEND_URL=http://127.0.0.1:3000
```

Run the checks while both apps are already running:

```bash
npm run test:e2e
```

Useful variants:

```bash
npm run test:e2e:headed
npm run test:e2e:ui
npm run test:e2e:debug
```

Notes:

- The suite creates unique users for isolation, so it does not need a shared seeded account.
- Todos created during tests are deleted in the main CRUD flow, but user rows will accumulate over time unless you reset the test database.
- The tests currently use accessible labels and visible text. For even more stability, consider adding `data-testid` attributes to key elements like auth forms, todo cards, and status banners.

## Routes

- `/`
- `/login`
- `/register`
- `/todos`
- `/todos/:id`

## UI Notes

The design uses warm paper tones, teal action colors, rounded cards, and a simple dashboard layout. The todo page keeps creation on the left and task management on the right on desktop, then stacks neatly on mobile.
