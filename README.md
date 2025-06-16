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
127.0.0.1 vue.localhost.com
127.0.0.1 api.localhost.com
```

After that, you must add the self-signed certificate to your browser as a certificate authority
(in this case, it is the `infrastructure/nginx/ssl/myCA.pem` file).
Or just use your own purchased domain and certificate for it.

Some startup parameters can be edited in the `.env` file.

## Project launch

### Development

```sh
docker compose -f docker-compose.yml -f dev.yml up -d
```

This startup option allows you to link microservices folders to containers and adds utilities
for viewing the contents of PostgreSQL ([Adminer](https://github.com/vrana/adminer)),
Redis ([RedisInsight](https://github.com/RedisInsight/RedisInsight))
and RabbitMQ ([RabbitMQ Management Plugin](https://github.com/rabbitmq/rabbitmq-management)).

### Production

```sh
docker compose -f docker-compose.yml -f prod.yml up -d
```

This startup option leaves a minimal build and does not track changes in microservices folders.

### Shutting down

```sh
docker compose down --remove-orphans
```

### Additional commands

Install git pre-commit hook:

```sh
npm --prefix scripts ci
```

Install all dependencies in apps:

```sh
npm run install:all
```

Run linting for all apps:

```sh
npm run lint:all
```

## Microservices

### Apps

#### Frontend

##### React

![preview-sign-in.png](preview-sign-in.png 'Sign In Screen preview')
![preview-profile.png](preview-profile.png 'Profile Screen preview')
![preview-roles.png](preview-roles.png 'Role Screen preview')

This microservice provides a graphical interface for administration.
In it, you can set a list of protected links, create roles with rights for links, manage registered users.
The service is written in [React](https://github.com/facebook/react), [Next.js](https://github.com/vercel/next.js)
and [TypeScript](https://github.com/microsoft/TypeScript) with **FSD**-like structure.
[Material UI](https://github.com/mui/material-ui) is used as the UI kit.
[Redux Toolkit](https://github.com/reduxjs/redux-toolkit) is used as the application state manager.
[RTK Query](https://github.com/rtk-incubator/rtk-query) is used for API requests.

Service folder: `apps/frontend/panel-react`.

##### Vue

Implements the same functionality as the first frontend, but instead of React, [Vue](https://github.com/vuejs/core) is used,
and instead of Next.js, [Nuxt](https://github.com/nuxt/nuxt) is used.
Instead of [Node.js](https://github.com/nodejs), the container uses [Bun](https://github.com/oven-sh/bun).
State manager - [Pinia](https://github.com/vuejs/pinia).
UI kit - [Vuetify](https://github.com/vuetifyjs/vuetify).

Service folder: `apps/frontend/panel-vue`.

#### Backend

##### API server

The main server that provides the client's interaction with databases,
authorization (JWT), creation of requests for sending emails.
When registering the first user, creates standard API-endpoints,
roles and assigns administrator role to the first registered user.
Written in [NestJS](https://github.com/nestjs/nest).

Service folder: `apps/backend/api`.

##### Mail server

This service is engaged in sending emails.
It is built using the same technologies as the main server.
If the mailer is running in testing mode, then links to view the contents
of sent emails are available in the container console.

Service folder: `apps/backend/mailer`.

### Infrastructure

#### Proxy

[Nginx](https://github.com/nginx/agent) is used as a proxy server and provides the HTTPS protocol.

Service folder: `infrastructure/nginx`.
In the `./html` folder you can change the default nginx response pages.
The `./ssl` folder is used to store the SSL certificate files.
In the file `./templates/default.conf.template` you can set routing rules.

#### Database

[PostgreSQL](https://github.com/postgres/postgres) is used as the main database of the project.

Service folder: `infrastructure/postgres`.
In the file `./postgresql.conf` you can set the parameters of PostgreSQL.

#### Cache store

[Redis](https://github.com/redis/redis) is used to store user sessions.

Service folder: `infrastructure/redis`.
In the file `./redis.conf` you can set the parameters of Redis.

#### Message broker

[RabbitMQ](https://github.com/rabbitmq/rabbitmq-tutorials) is used to send requests for sending emails.

Service folder: `infrastructure/rabbitmq`.
In the file `./rabbitmq.conf` you can set the parameters of RabbitMQ.

## Other folders

The `shared` folder is intended to store common types, utilities, and dictionaries between the frontend and backend.
Currently, containers are configured to use this folder (adding a dependency to `package.json` for development and `tsconfig.json` for build,
and mounting volumes for Docker) without switching to _npm workspaces_.

The `scripts` folder currently contains only a hook for _git_, which is configured to run
tests and linters in applications before commit, and a small script for installing it.

## SSL update

Without a certificate, the project will not function normally (CORS policy).
The standard certificate is registered for addresses _localhost.com_ ([React](#react)),
_vue.localhost.com_ ([Vue](#vue)) and _api.localhost.com_ ([API server](#api-server)).
It has a limited duration.
To create a new certificate, you can use the following commands:

1. Launching a Docker container to create a certificate

   ```sh
   docker run --rm -v ./infrastructure/nginx/ssl:/usr/ssl -w /usr/ssl -it --entrypoint /bin/ash frapsoft/openssl
   ```

2. Generate private key

   ```sh
   openssl genrsa -des3 -out myCA.key 2048
   ```

3. Generate root certificate

   ```sh
   openssl req -x509 -new -nodes -key myCA.key -sha256 -days 825 -out myCA.pem
   ```

4. Use your own domain name

   ```sh
   NAME=localhost.com
   ```

5. Generate a private key

   ```sh
   openssl genrsa -out $NAME.key 2048
   ```

6. Create a certificate-signing request

   ```sh
   openssl req -new -key $NAME.key -out $NAME.csr
   ```

7. Create a config file for the extensions

   ```sh
   cat > $NAME.ext <<EOF
   authorityKeyIdentifier=keyid,issuer
   basicConstraints=CA:FALSE
   keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
   subjectAltName = @alt_names
   [alt_names]
   DNS.1 = $NAME
   DNS.2 = www.$NAME
   DNS.3 = vue.$NAME
   DNS.4 = api.$NAME
   IP.1 = 127.0.0.1
   EOF
   ```

8. Create the signed certificate

   ```sh
   openssl x509 -req -in $NAME.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
   -out $NAME.crt -days 825 -sha256 -extfile $NAME.ext
   ```

9. Exit from the container

   ```sh
   exit
   ```

## Conclusion

I tried to implement the most common use cases of technologies,
trying to follow the solutions from their documentation as much as possible.
Hope this will be useful for someone.
