FROM postgres:alpine as development
WORKDIR /home/postgres
CMD ["-c", "config_file=./postgresql.conf"]

FROM development as production
COPY ./postgresql.conf ./postgresql.conf