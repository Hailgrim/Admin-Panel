FROM node:lts-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
ARG HOME=/usr/src/app
WORKDIR ${HOME}
COPY ./next/package*.json .

FROM base AS development
ENV NODE_ENV=development
# NOTE: Windows hot reload fix
ENV WATCHPACK_POLLING=true
RUN npm install
CMD ["npx", "next", "dev"]

FROM base AS builder
ARG NGINX_HOST
ARG NEXT_HOST_PREFIX
ARG NEST_CORE_HOST
ARG NEST_CORE_PORT
ARG GOOGLE_CLIENT_ID
RUN apk add --no-cache libc6-compat
COPY ./shared ../shared
RUN npm ci
COPY ./next .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
COPY --from=builder ${HOME}/public ./public
COPY --from=builder --chown=${USER}:${USER} ${HOME}/.next/standalone ./
COPY --from=builder --chown=${USER}:${USER} ${HOME}/.next/static ./.next/static
USER ${USER}
ENTRYPOINT ["node", "server.js"]