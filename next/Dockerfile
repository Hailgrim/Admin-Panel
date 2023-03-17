FROM node:alpine as base
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/next

FROM base as development
ENV NODE_ENV=development
COPY ./package*.json .
RUN npm install
CMD npx next dev -p ${NEXT_PORT}

FROM base as production
ENV NODE_ENV=production
COPY . .
RUN npm install
RUN npm run build
CMD npx next start -p ${NEXT_PORT}