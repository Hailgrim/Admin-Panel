FROM node:lts-alpine AS base
ARG HOST_DIR=/apps/backend/api
ARG SUB_DIR=/usr/src/app
ARG HOME_DIR=${SUB_DIR}${HOST_DIR}
WORKDIR ${HOME_DIR}
COPY ${HOST_DIR}/package*.json .

FROM base AS development
ENV NODE_ENV=development
COPY ./shared ${SUB_DIR}/shared
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY ./shared ${SUB_DIR}/shared
RUN npm ci
COPY ${HOST_DIR} .
RUN npm run build
RUN npm prune --production

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
ARG GROUP=node
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/node_modules ./node_modules
COPY --from=builder --chown=${USER}:${GROUP} ${HOME_DIR}/dist ./dist
USER ${USER}
ENTRYPOINT ["node", "./dist/apps/backend/api/src/main.js"]