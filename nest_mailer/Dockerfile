FROM node:alpine as base
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/nest_mailer

FROM base as development
ENV NODE_ENV=development
COPY ./package*.json .
RUN npm install
CMD npm run start:dev

FROM base as production
ENV NODE_ENV=production
COPY . .
RUN npm install --omit=dev
RUN npm run build
CMD npm run start:prod