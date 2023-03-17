FROM nginx:alpine as base

FROM base as development
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/nginx

FROM base as production
ARG PROJECT_TAG
WORKDIR /home/${PROJECT_TAG}/nginx
COPY . .