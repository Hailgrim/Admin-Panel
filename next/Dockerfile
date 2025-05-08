FROM node:lts-alpine AS base
ARG NEXT_TELEMETRY_DISABLED=1
ARG HOME=/home/node
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
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder ${HOME}/public ./public
COPY --from=builder --chown=nextjs:nodejs ${HOME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ${HOME}/.next/static ./.next/static
USER nextjs
CMD ["node", "server.js"]