import { DEV } from '@ap/shared';

export const cfg = {
  mode: process.env.NODE_ENV || DEV,
  host: process.env.NEST_MAILER_HOST ? '0.0.0.0' : 'localhost',
  port: Number(process.env.NEST_MAILER_PORT || 3001),
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
  mail: {
    test: true, // 'true' in test project, 'MODE === DEV' in real project
    host: process.env.NEST_MAILER_MAIL_HOST || 'localhost',
    port: Number(process.env.NEST_MAILER_MAIL_PORT) || 587,
    user: process.env.NEST_MAILER_MAIL_USER || 'user',
    password: process.env.NEST_MAILER_MAIL_PASSWORD || 'password',
    from: `"No Reply" <no-reply@${process.env.PROJECT_TAG || 'AP'}>`,
  },
};
