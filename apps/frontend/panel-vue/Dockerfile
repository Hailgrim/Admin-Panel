FROM oven/bun:alpine AS base
ENV NUXT_TELEMETRY_DISABLED=1
ARG HOME=/usr/src/app
WORKDIR ${HOME}
ARG ROOT=./apps/frontend/panel-vue
COPY ${ROOT}/package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV CHOKIDAR_USEPOLLING=true
RUN bun install
COPY ${ROOT} .
CMD ["bun", "--bun", "run", "dev"]

FROM base AS builder
ARG PANEL_VUE_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
RUN bun install
COPY ${ROOT} .
COPY ./shared ./utils
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=bun
ARG GROUP=bun
COPY --from=builder --chown=${USER}:${GROUP} ${HOME}/.output ./.output
USER ${USER}
ENTRYPOINT ["bun", ".output/server/index.mjs"]