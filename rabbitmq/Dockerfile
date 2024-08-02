FROM rabbitmq:management-alpine AS development
WORKDIR /home/rabbitmq
ENV RABBITMQ_CONFIG_FILES=./conf.d

FROM rabbitmq:alpine AS production
WORKDIR /home/rabbitmq
ENV RABBITMQ_CONFIG_FILES=./conf.d
COPY ./conf.d ./conf.d