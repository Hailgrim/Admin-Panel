FROM node:lts-alpine as base
ARG HOME=/home/node
WORKDIR ${HOME}
COPY ./package*.json .

FROM base as development
ENV NODE_ENV=development
RUN npm install
CMD npm run start:dev

FROM base as builder
ARG NEST_CORE_HOST
ARG NEST_CORE_PORT
ARG NGINX_HOST
ARG RABBITMQ_HOST
ARG RABBITMQ_PORT
ARG RABBITMQ_DEFAULT_USER
ARG RABBITMQ_DEFAULT_PASS
ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG REDIS_DB
ARG ACCESS_TOKEN_LIFETIME
ARG ACCESS_TOKEN_SECRET_KEY
ARG REFRESH_TOKEN_LIFETIME
ARG REFRESH_TOKEN_SECRET_KEY
RUN apk add --no-cache libc6-compat
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM base as production
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
COPY --from=builder ${HOME}/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs ${HOME}/dist ./dist
USER nestjs
CMD node ./dist/src/main.js