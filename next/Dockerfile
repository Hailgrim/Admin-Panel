FROM oven/bun:alpine as base
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/next

FROM base as development
ENV NODE_ENV=development
COPY ./package*.json .
RUN bun install
CMD bun --bun run dev -p ${NEXT_PORT}

FROM base as production
ENV NODE_ENV=production
COPY . .
RUN bun install
RUN bun --bun run build
CMD bun --bun run start -p ${NEXT_PORT}