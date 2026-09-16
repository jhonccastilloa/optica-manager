# Self-contained deployment

This project is self-contained: one `docker compose` command starts the Nginx
frontend, Express API, PostgreSQL, and the one-off Prisma migration service.
Only the frontend publishes a host port (`3000`). Its Nginx proxies `/api/*` to
the API on Docker's internal network, so the browser uses one origin and does
not require production CORS configuration.

```text
http://localhost:3000
        │
        ▼
   Frontend Nginx
     ├─ /       → React build
     └─ /api/*  → Express API → PostgreSQL
```

## First deployment

1. Create the production environment file without committing it:

   ```sh
   cp .env.production.example .env.production
   ```

   Set a long unique database password. If the password has URL-reserved
   characters, URL-encode it in `DATABASE_URL`.

2. Start the stack:

   ```sh
   docker compose --env-file .env.production up -d --build
   ```

   Compose automatically creates the internal network, waits for PostgreSQL,
   runs `prisma migrate deploy` in the `migrate` service, then starts the API
   and frontend. Open `http://localhost:3000`.

## Updates

```sh
git pull
docker compose --env-file .env.production up -d --build
docker compose --env-file .env.production ps
```

Inspect a failed migration or application startup with:

```sh
docker compose --env-file .env.production logs migrate
docker compose --env-file .env.production logs api
```

`postgres_data` is a named Docker volume. It survives normal container
replacements and `docker compose down`; it is deleted only by an explicit
`docker compose down --volumes`. Back it up before upgrades that include data
migrations.

## Local development

Continue using the existing Vite and API development commands. Without an
explicit `VITE_API_URL`, the development frontend calls
`http://localhost:3000`. The production build omits this variable, so the
browser calls `/api` and the frontend Nginx routes that request to the API.
