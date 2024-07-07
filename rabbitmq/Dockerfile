FROM rabbitmq:management-alpine as development
WORKDIR /home/rabbitmq
ENV RABBITMQ_CONFIG_FILES=./conf.d

FROM rabbitmq:alpine as production
WORKDIR /home/rabbitmq
ENV RABBITMQ_CONFIG_FILES=./conf.d
COPY ./conf.d ./conf.d