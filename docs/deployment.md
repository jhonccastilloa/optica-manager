# Deployment behind the global Nginx

This project runs three application services: an Nginx container that serves the
Vite build, the Express API, and PostgreSQL. Neither the frontend nor the API
publishes a host port. They join the external Docker network used by the global
Nginx, which routes the application's domain to each service:

```text
optica.internal.example
        │
        ▼
   Global Nginx
     ├─ /       → optica-web:80
     └─ /api/*  → optica-api:3000
```

The browser calls `/api`, so frontend and API remain on the same origin and do
not require production CORS configuration.

## First deployment

1. Create the external network once. The global Nginx container must be joined
   to this same network.

   ```sh
   docker network create internal-proxy
   ```

2. Create the production environment file without committing it:

   ```sh
   cp .env.production.example .env.production
   ```

   Set a long unique database password. If the password has URL-reserved
   characters, URL-encode it in `DATABASE_URL`. Keep `PROXY_NETWORK` equal to
   the shared Docker network name.

3. Start the stack:

   ```sh
   docker compose --env-file .env.production up -d --build
   ```

   Compose waits for PostgreSQL, runs `prisma migrate deploy` in the `migrate`
   service, then starts the API and frontend.

4. Add [the Optica virtual host](../deploy/nginx/optica.global.conf) to the
   global Nginx configuration, replace `optica.internal.example` with the real
   internal domain, and reload that Nginx instance.

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
browser calls `/api` and the global Nginx routes that request to the API.
