# Admin Panel

This is a boilerplate project that implements the functionality of the admin panel.
The project is built using microservices architecture.
To run it, you will need to install [Docker](https://github.com/docker).

## Before starting work

For a local proxy, add this to hosts:

```sh
# C:\Windows\System32\drivers\etc\hosts on Windows
# or
# /etc/hosts on Linux
127.0.0.1 localhost.com
127.0.0.1 www.localhost.com
127.0.0.1 nuxt.localhost.com
127.0.0.1 api.localhost.com
```

After that, you must add the self-signed certificate to your browser as a certificate authority (in this case, it is the `./nginx/ssl/myCA.pem` file).

Some startup parameters can be edited in the `./.env` file.

## Project launch

### Development

```sh
docker compose -f docker-compose.yml -f dev.yml up -d
```

This startup option allows you to link microservices folders to containers and adds utilities for viewing the contents of PostgreSQL ([Adminer](https://github.com/vrana/adminer)), Redis ([RedisInsight](https://github.com/RedisInsight/RedisInsight)) and RabbitMQ ([RabbitMQ Management Plugin](https://github.com/rabbitmq/rabbitmq-management)).

### Production

```sh
docker compose -f docker-compose.yml -f prod.yml up -d
```

This startup option leaves a minimal build and does not track changes in microservices folders.

### Shutting down

```sh
docker compose down --remove-orphans
```

## Microservices

### [Next.js](https://github.com/vercel/next.js)

This microservice provides a graphical interface for administration.
In it, you can set a list of protected links, create roles with rights for links, manage registered users.
The service is written in [React](https://github.com/facebook/react) and [TypeScript](https://github.com/microsoft/TypeScript).
[Material UI](https://github.com/mui/material-ui) is used as the UI kit.
[Redux Toolkit](https://github.com/reduxjs/redux-toolkit) is used as the application state manager.
[RTK Query](https://github.com/rtk-incubator/rtk-query) is used for API requests.
In the `./next/src/store` folder, you can make changes to the application state management logic.
The `./next/src/lib/config.ts` file contains the settings received from Docker during project startup.
In the file `./next/lib/function.ts` using the `getServerSidePropsCustom` function, you can make SSR requests to verify the presence of user authorization tokens.

### [Nuxt.js](https://github.com/nuxt/nuxt)

Implements the same functionality as Next.js, but [Vue](https://github.com/vuejs/core) is used instead of React.
Instead of [Node.js](https://github.com/nodejs), the container uses [Bun](https://github.com/oven-sh/bun).
State manager ([Pinia](https://github.com/vuejs/pinia)) folder - `./nuxt/store`.
UI kit - [Vuetify](https://github.com/vuetifyjs/vuetify).

### Main server

The main server that provides the client's interaction with databases, authorization (JWT), creation of requests for sending emails.
When registering the first user, creates standard API-endpoints, roles and assigns administrator role to the first registered user.
Written in [Nest.js](https://github.com/nestjs/nest).
The `./nest_core/libs/config.ts` file contains the settings received from Docker during project startup.

### Mail server

This service is engaged in sending emails.
It is built using the same technologies as the main server.
If the mailer is running in testing mode, then links to view the contents of sent emails are available in the container console.
This behavior is changed in the file `./nest_mailer/libs/config.ts` using the variable `MAIL_TEST`.

### [nginx](https://github.com/nginx/agent)

Nginx is used as a proxy server and provides the HTTPS protocol.
In the `./nginx/html` folder, you can change the standard nginx response pages.
The `./nginx/ssl` folder is used to store the SSL certificate files.
In the `./nginx/templates/default.conf.template` file, you can set rules for routing.

### [PostgreSQL](https://github.com/postgres/postgres)

This is the main database of the project.

### [Redis](https://github.com/redis/redis)

This database is used for secondary storage of user sessions.
In the `./redis/redis.conf` file, you can set Redis parameters.

### [RabbitMQ](https://github.com/rabbitmq/rabbitmq-tutorials)

A queue manager that is used to send requests for sending emails.

## SSL update

Without a certificate, the project will not function normally (CORS policy).
The standard certificate is registered for addresses localhost.com (Next.js), nuxt.localhost.com (Nuxt.js) and api.localhost.com (main server).
It has a limited duration.
To create a new certificate, you can use the following commands:

```sh
# Launching a Docker container to create a certificate
docker run -it --entrypoint /bin/ash frapsoft/openssl

# Generate private key
openssl genrsa -des3 -out myCA.key 2048

# Generate root certificate
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 825 -out myCA.pem

NAME=localhost.com # Use your own domain name

# Generate a private key
openssl genrsa -out $NAME.key 2048

# Create a certificate-signing request
openssl req -new -key $NAME.key -out $NAME.csr

# Create a config file for the extensions
touch $NAME.ext

# $NAME.ext content
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost.com
DNS.2 = www.localhost.com
DNS.3 = nuxt.localhost.com
DNS.4 = api.localhost.com
IP.1 = 127.0.0.1

# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out $NAME.crt -days 825 -sha256 -extfile $NAME.ext
```
