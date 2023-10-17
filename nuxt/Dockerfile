FROM oven/bun:alpine as base
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/nuxt

FROM base as development
ENV NODE_ENV=development
ENV PORT=${NUXT_PORT}
ENV CHOKIDAR_USEPOLLING=true
COPY ./package*.json .
RUN bun install
CMD bun run dev

FROM base as production
ENV NODE_ENV=production
ENV PORT=${NUXT_PORT}
COPY . .
RUN bun install
RUN bun run build
CMD bun .output/server/index.mjs