FROM node:alpine as base
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/nuxt

FROM base as development
ENV NODE_ENV=development
ENV PORT=${NUXT_PORT}
COPY ./package*.json .
RUN npm install
CMD npm run dev

FROM base as production
ENV NODE_ENV=production
ENV PORT=${NUXT_PORT}
COPY . .
RUN npm install
RUN npm run build
CMD node .output/server/index.mjs