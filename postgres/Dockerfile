FROM postgres:alpine AS development
WORKDIR /home/postgres
CMD ["-c", "config_file=./postgresql.conf"]

FROM development AS production
COPY ./postgresql.conf ./postgresql.conf