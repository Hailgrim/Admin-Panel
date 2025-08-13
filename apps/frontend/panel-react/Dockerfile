FROM node:lts-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ARG HOME=/usr/src/app
WORKDIR ${HOME}
ARG ROOT=./apps/frontend/panel-react
COPY ${ROOT}/package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV WATCHPACK_POLLING=true
RUN npm install
COPY ${ROOT} .
CMD ["npx", "next", "dev"]

FROM base AS builder
ARG PANEL_REACT_URL
ARG API_HOST
ARG API_PORT
ARG API_URL
ARG GOOGLE_CLIENT_ID
RUN apk add --no-cache libc6-compat
COPY ./shared ../shared
RUN npm ci
COPY ${ROOT} .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder ${HOME}/public ./public
COPY --from=builder --chown=${USER}:${GROUP} ${HOME}/.next/standalone ./
COPY --from=builder --chown=${USER}:${GROUP} ${HOME}/.next/static ./.next/static
USER ${USER}
ENTRYPOINT ["node", "server.js"]