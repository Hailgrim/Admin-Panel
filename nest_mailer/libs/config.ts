import { DEV } from '@ap/shared';

export const MODE = process.env.NODE_ENV || DEV;
export const PROJECT_TAG = process.env.PROJECT_TAG || 'AP';

export const HOST = process.env.NEST_MAILER_HOST ? '0.0.0.0' : 'localhost';
export const PORT = Number(process.env.NEST_MAILER_PORT || 3001);

export const RMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
export const RMQ_PORT = Number(process.env.RABBITMQ_PORT) || 5672;
export const RMQ_USER = process.env.RABBITMQ_DEFAULT_USER || 'user';
export const RMQ_PASSWORD = process.env.RABBITMQ_DEFAULT_PASS || 'password';
export const RMQ_MAIL_QUEUE = process.env.RABBITMQ_MAIL_QUEUE || 'mailQueue';

export const MAIL_REGISTRATION =
  process.env.MAIL_REGISTRATION || 'registration';
export const MAIL_FORGOT_PASSWORD =
  process.env.MAIL_FORGOT_PASSWORD || 'forgotPassword';
export const MAIL_CHANGE_EMAIL = process.env.MAIL_CHANGE_EMAIL || 'changeEmail';

// MAIL_TEST in test project
export const MAIL_TEST = true;
// MAIL_TEST in real project
// export const MAIL_TEST = MODE === DEV;
export const MAIL_HOST = process.env.NEST_MAILER_MAIL_HOST || 'localhost';
export const MAIL_PORT = Number(process.env.NEST_MAILER_MAIL_PORT) || 587;
export const MAIL_USER = process.env.NEST_MAILER_MAIL_USER || 'user';
export const MAIL_PASSWORD =
  process.env.NEST_MAILER_MAIL_PASSWORD || 'password';
export const MAIL_FROM = `"No Reply" <no-reply@${PROJECT_TAG}>`;
