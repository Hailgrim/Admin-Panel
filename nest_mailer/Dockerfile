FROM node:lts-alpine as base
ARG HOME=/home/node
WORKDIR ${HOME}
COPY ./package*.json .

FROM base as development
ENV NODE_ENV=development
RUN npm install
CMD npm run start:dev

FROM base as builder
ARG PROJECT_TAG
ARG NEST_MAILER_HOST
ARG NEST_MAILER_PORT
ARG RABBITMQ_HOST
ARG RABBITMQ_PORT
ARG RABBITMQ_DEFAULT_USER
ARG RABBITMQ_DEFAULT_PASS
ARG NEST_MAILER_MAIL_HOST
ARG NEST_MAILER_MAIL_PORT
ARG NEST_MAILER_MAIL_USER
ARG NEST_MAILER_MAIL_PASSWORD
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
COPY --from=builder --chown=nestjs:nodejs ${HOME}/templates ./templates
USER nestjs
CMD node ./dist/src/main.js