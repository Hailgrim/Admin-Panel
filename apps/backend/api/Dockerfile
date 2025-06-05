FROM node:lts-alpine AS base
ARG HOME=/usr/src/app
WORKDIR ${HOME}
ARG ROOT=./apps/backend/api
COPY ${ROOT}/package*.json .

FROM base AS development
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY ./shared ./src/shared
RUN npm ci
COPY ${ROOT} .
RUN npm run build
RUN npm prune --production

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder --chown=${USER}:${GROUP} ${HOME}/node_modules ./node_modules
COPY --from=builder --chown=${USER}:${GROUP} ${HOME}/dist ./dist
USER ${USER}
ENTRYPOINT ["node", "./dist/src/main.js"]