FROM oven/bun:alpine AS base
ENV NUXT_TELEMETRY_DISABLED=1
ARG HOST_DIR=/apps/frontend/panel-vue
ARG SUB_DIR=/usr/src/app
ARG HOME_DIR=${SUB_DIR}${HOST_DIR}
WORKDIR ${HOME_DIR}
COPY ${HOST_DIR}/package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV CHOKIDAR_USEPOLLING=true
COPY ./shared ${SUB_DIR}/shared
RUN bun install
CMD ["bun", "--bun", "run", "dev"]

FROM base AS builder
ARG PANEL_VUE_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
COPY ./shared ${SUB_DIR}/shared
RUN bun install
COPY ${HOST_DIR} .
RUN bun run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=bun
ARG GROUP=bun
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/.output ./.output
USER ${USER}
ENTRYPOINT ["bun", ".output/server/index.mjs"]