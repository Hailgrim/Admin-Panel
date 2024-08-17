# Admin Panel

This is a boilerplate project that implements the functionality of the admin panel.
The project is built using microservices architecture.
To run it, you will need to install [Docker](https://github.com/docker).

## Before starting work

For a local proxy, add this to hosts:

```
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

### [Next.js](https://github.com/vercel/next.js) (`./next`)

![sign-up-preview.png](sign-up-preview.png 'Sign Up Screen preview')

![profile-preview.png](profile-preview.png 'Profile Screen preview')

![admin-preview.png](admin-preview.png 'Role Screen preview')

This microservice provides a graphical interface for administration.
In it, you can set a list of protected links, create roles with rights for links, manage registered users.
The service is written in [React](https://github.com/facebook/react) and [TypeScript](https://github.com/microsoft/TypeScript) with **FSD**-like structure.
[Material UI](https://github.com/mui/material-ui) is used as the UI kit.
[Redux Toolkit](https://github.com/reduxjs/redux-toolkit) is used as the application state manager.
[RTK Query](https://github.com/rtk-incubator/rtk-query) is used for API requests.
The `./next/src/shared/lib/config.ts` file contains the settings received from Docker during project startup.

### [Nuxt.js](https://github.com/nuxt/nuxt) (`./nuxt`)

Implements the same functionality as Next.js, but [Vue](https://github.com/vuejs/core) is used instead of React.
Instead of [Node.js](https://github.com/nodejs), the container uses [Bun](https://github.com/oven-sh/bun).
State manager - [Pinia](https://github.com/vuejs/pinia).
UI kit - [Vuetify](https://github.com/vuetifyjs/vuetify).

### Main server (`./nest_core`)

The main server that provides the client's interaction with databases, authorization (JWT), creation of requests for sending emails.
When registering the first user, creates standard API-endpoints, roles and assigns administrator role to the first registered user.
Written in [NestJS](https://github.com/nestjs/nest).
The `./nest_core/libs/config.ts` file contains the settings received from Docker during project startup.

### Mail server (`./nest_mailer`)

This service is engaged in sending emails.
It is built using the same technologies as the main server.
If the mailer is running in testing mode, then links to view the contents of sent emails are available in the container console.
This behavior is changed in the file `./nest_mailer/libs/config.ts` using the variable `MAIL_TEST`.

### [nginx](https://github.com/nginx/agent) (`./nginx`)

Nginx is used as a proxy server and provides the HTTPS protocol.
In the `./nginx/html` folder you can change the default nginx response pages.
The `./nginx/ssl` folder is used to store the SSL certificate files.
In the file `./nginx/templates/default.conf.template` you can set routing rules.

### [PostgreSQL](https://github.com/postgres/postgres) (`./postgres`)

This is the main database of the project.
In the file `./postgres/postgresql.conf` you can set the parameters of PostgreSQL.

### [Redis](https://github.com/redis/redis) (`./redis`)

This storage is used to store user sessions.
In the file `./redis/redis.conf` you can set the parameters of Redis.

### [RabbitMQ](https://github.com/rabbitmq/rabbitmq-tutorials) (`./rabbitmq`)

A queue manager that is used to send requests for sending emails.
In the file `./rabbitmq/conf.d/rabbitmq.conf` you can set the parameters of RabbitMQ.

## SSL update

Without a certificate, the project will not function normally (CORS policy).
The standard certificate is registered for addresses _localhost.com_ (Next.js), _nuxt.localhost.com_ (Nuxt.js) and _api.localhost.com_ (main server).
It has a limited duration.
To create a new certificate, you can use the following commands:

1. Launching a Docker container to create a certificate

   ```sh
   docker run -it --entrypoint /bin/ash frapsoft/openssl
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
   DNS.3 = nuxt.$NAME
   DNS.4 = api.$NAME
   IP.1 = 127.0.0.1
   EOF
   ```

8. Create the signed certificate

   ```sh
   openssl x509 -req -in $NAME.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
   -out $NAME.crt -days 825 -sha256 -extfile $NAME.ext
   ```

## Conclusion

I tried to implement the most common use cases of technologies,
trying to follow the solutions from their documentation as much as possible.
Hope this will be useful for someone.
