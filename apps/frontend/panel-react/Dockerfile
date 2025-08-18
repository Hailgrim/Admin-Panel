FROM node:lts-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ARG HOST_DIR=/apps/frontend/panel-react
ARG SUB_DIR=/usr/src/app
ARG HOME_DIR=${SUB_DIR}${HOST_DIR}
WORKDIR ${HOME_DIR}
COPY ${HOST_DIR}/package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV WATCHPACK_POLLING=true
COPY ./shared ${SUB_DIR}/shared
RUN npm install
CMD ["npx", "next", "dev"]

FROM base AS builder
ARG PANEL_REACT_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
RUN apk add --no-cache libc6-compat
COPY ./shared ${SUB_DIR}/shared
RUN npm ci
COPY ${HOST_DIR} .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder ${HOME_DIR}/public ./public
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/.next/standalone ./
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/.next/static ./.next/static
USER ${USER}
ENTRYPOINT ["node", "server.js"]