# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /workspace


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile


FROM dependencies AS builder

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder \
    pnpm --filter @optica/api exec prisma generate
RUN pnpm --filter @optica/contracts build
RUN pnpm --filter @optica/web build
RUN pnpm --filter @optica/api build
RUN pnpm --filter @optica/api --prod deploy /prod/api


FROM dependencies AS migrator

COPY . .

CMD ["pnpm", "--filter", "@optica/api", "exec", "prisma", "migrate", "deploy"]


FROM node:24-bookworm-slim AS api-production

ENV NODE_ENV=prod
ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /app

COPY --from=builder /prod/api ./

EXPOSE 3000

USER node

CMD ["node", "dist/app.js"]


FROM nginx:1.28-alpine AS frontend-production

COPY deploy/nginx/frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/apps/web/dist /usr/share/nginx/html
