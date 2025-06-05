FROM postgres:alpine AS development
CMD ["-c", "config_file=/etc/postgresql/postgresql.conf"]

FROM development AS production
COPY ./postgresql.conf /etc/postgresql/postgresql.conf