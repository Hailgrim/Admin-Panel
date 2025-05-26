import { DEV } from '@ap/shared';

export const cfg = {
  mode: process.env.NODE_ENV || DEV,
  host: process.env.NEST_CORE_HOST || '0.0.0.0',
  port: Number(process.env.NEST_CORE_PORT || 3000),
  tokens: {
    access: {
      /** Time in seconds */
      lifetime: Number(process.env.ACCESS_TOKEN_LIFETIME) || 60 * 60,
      secret:
        process.env.NEST_CORE_ACCESS_TOKEN_SECRET_KEY || 'accessTokenSecretKey',
    },
    refresh: {
      /** Time in seconds */
      lifetime: Number(process.env.REFRESH_TOKEN_LIFETIME) || 60 * 60 * 24 * 7,
      secret:
        process.env.NEST_CORE_REFRESH_TOKEN_SECRET_KEY ||
        'refreshTokenSecretKey',
    },
  },
  nginx: {
    host: process.env.NGINX_HOST || 'localhost',
  },
  rmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    user: process.env.RABBITMQ_DEFAULT_USER || 'user',
    password: process.env.RABBITMQ_DEFAULT_PASS || 'password',
    mailQueue: process.env.RABBITMQ_MAIL_QUEUE || 'mailQueue',
    cmd: {
      registration: process.env.MAIL_REGISTRATION || 'registration',
      forgotPassword: process.env.MAIL_FORGOT_PASSWORD || 'forgotPassword',
      changeEmail: process.env.MAIL_CHANGE_EMAIL || 'changeEmail',
    },
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    db: process.env.POSTGRES_DB || 'main',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    user: process.env.REDIS_USER || 'user',
    password: process.env.REDIS_PASSWORD || 'password',
    db: Number(process.env.REDIS_DB) || 0,
  },
};
