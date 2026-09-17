# Self-contained deployment

This project is self-contained: one `docker compose` command starts the Nginx
frontend, Express API, PostgreSQL, and the one-off Prisma migration service.
The frontend and API are separate HTTP services: the frontend publishes port
`4444` by default and the API publishes port `3000` by default. Both host ports
can be changed with `FRONTEND_PUBLISHED_PORT` and `API_PUBLISHED_PORT`. The
browser calls the API using the `VITE_API_URL` value compiled into the
frontend, so production CORS is configured with `CORS_ORIGIN`.

```text
http://localhost:4444
        │
        ▼
   Frontend Nginx
     └─ /       → React build

http://localhost:4444 ──browser──→ http://localhost:3000/api/*
                                      │
                                      ▼
                                  Express API ──→ PostgreSQL
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
   and frontend. Open `http://localhost:4444`.

   `VITE_API_URL` is the API's browser-facing URL, while `CORS_ORIGIN` is the
   browser-facing URL of the frontend. By default, both are built from the
   published ports. If the services use different servers, replace the two
   generated values with their public domain names or IP addresses. The
   frontend image must be rebuilt after changing `VITE_API_URL`.

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
`http://localhost:3000`. Production builds require `VITE_API_URL`; Nginx only
serves the frontend and does not proxy API requests.
