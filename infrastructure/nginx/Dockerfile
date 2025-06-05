FROM nginx:alpine AS development

FROM development AS production
COPY ./html /usr/share/nginx/html
COPY ./ssl /usr/share/nginx/ssl
COPY ./templates /etc/nginx/templates