FROM oven/bun:alpine AS base
ENV NUXT_TELEMETRY_DISABLED=1
ARG HOME=/usr/src/app
WORKDIR ${HOME}
COPY ./nuxt/package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV CHOKIDAR_USEPOLLING=true
RUN bun install
CMD ["bun", "--bun", "run", "dev"]

FROM base AS builder
ARG NGINX_HOST
ARG NUXT_HOST_PREFIX
ARG NEST_CORE_HOST
ARG NEST_CORE_PORT
ARG GOOGLE_CLIENT_ID
RUN bun install
COPY ./nuxt .
COPY ./shared ./utils
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=bun
COPY --from=builder --chown=${USER}:${USER} ${HOME}/.output ./.output
USER ${USER}
ENTRYPOINT ["bun", ".output/server/index.mjs"]