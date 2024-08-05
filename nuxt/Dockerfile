FROM oven/bun:alpine AS base
ARG NUXT_TELEMETRY_DISABLED=1
ARG HOME=/home/bun
WORKDIR ${HOME}
COPY ./package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV CHOKIDAR_USEPOLLING=true
RUN bun install
CMD bun --bun run dev

FROM base AS builder
ARG NGINX_HOST
ARG NEST_CORE_HOST
ARG NEST_CORE_PORT
ARG ACCESS_TOKEN_LIFETIME
ARG REFRESH_TOKEN_LIFETIME
RUN bun install
COPY . .
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 nuxtjs
COPY --from=builder --chown=nuxtjs:bunjs ${HOME}/.output ./.output
USER nuxtjs
CMD bun .output/server/index.mjs