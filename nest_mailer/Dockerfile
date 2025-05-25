FROM node:lts-alpine AS base
ARG HOME=/usr/src/app
WORKDIR ${HOME}
COPY ./nest_mailer/package*.json .

FROM base AS development
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY ./shared ./src/shared
RUN npm ci
COPY ./nest_mailer .
RUN npm run build
RUN npm prune --production

FROM base AS production
ENV NODE_ENV=production
ARG USER=node
COPY --from=builder --chown=${USER}:${USER} ${HOME}/node_modules ./node_modules
COPY --from=builder --chown=${USER}:${USER} ${HOME}/dist ./dist
COPY --from=builder --chown=${USER}:${USER} ${HOME}/templates ./templates
USER ${USER}
ENTRYPOINT ["node", "./dist/src/main.js"]