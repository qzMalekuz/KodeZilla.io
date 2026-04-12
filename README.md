# KodeZilla.io - Contest Platform

![KodeZilla Banner](kodezilla-banner.png)

The project is now split into a backend in `BE/` and a lightweight browser frontend in `FE/`.

## Structure

```text
BE/
  src/
  prisma/
  package.json
  tsconfig.json
  prisma.config.ts

FE/
  index.html
  app.jsx
  server.ts
  styles.css
  package.json

.env
package.json
```

## Backend

The API lives in `BE/` and still uses Bun, Express, Prisma, PostgreSQL, JWT, and Zod.

Useful commands from the repo root:

```bash
bun run dev:be
bun run typecheck:be
bun run prisma:generate
bun run prisma:migrate
```

The backend loads environment variables from the repo root `.env`.
The frontend proxy can also read `BACKEND_URL` from the same file.

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/contestdb
JWT_SECRET=your_secret_key
SALT_ROUNDS=10
PORT=3000
BACKEND_URL=http://localhost:3000
```

## Frontend

The frontend lives in `FE/` as a React app bundled with Bun and served by a small Bun server.
That FE server also proxies `/api/*` calls to the backend, so the browser can talk to the API through the frontend origin.

It supports:

- signup and login
- token storage
- listing contests
- contest detail and leaderboard lookup
- creator flows for contest, MCQ, and DSA creation
- contestant flows for MCQ and DSA submission

Run it from the repo root:

```bash
bun run build:fe
bun run dev:fe
```

Then open `http://localhost:5173`.

## Notes

- The frontend now defaults to `${window.location.origin}/api`, and the FE server proxies that to `BACKEND_URL` or `http://localhost:3000`.
- The React entry point is `FE/app.jsx` and Bun emits the browser bundle to `FE/dist/app.js`.
- A new authenticated route, `GET /api/contests`, was added to make the frontend contest list possible.
- CORS headers are enabled in the backend so the static frontend can call the API during development.
