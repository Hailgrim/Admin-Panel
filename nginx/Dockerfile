FROM nginx:alpine AS development
WORKDIR /home/nginx

FROM development AS production
COPY ./html ./html
COPY ./ssl ./ssl
COPY ./templates ./templates