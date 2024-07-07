FROM nginx:alpine as development
WORKDIR /home/nginx

FROM development as production
COPY ./html ./html
COPY ./ssl ./ssl
COPY ./templates ./templates