import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';

import { AppModule } from './app.module';
import lang from '../libs/lang';
import { version } from '../package.json';
import { HOST, NGINX_HOST, PORT } from 'libs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyCookie as any);
  await app.register(fastifyHelmet as any);

  const config = new DocumentBuilder()
    .setTitle(String(lang.get('en')?.adminPanel))
    .setDescription(String(lang.get('en')?.adminPanelAPIDescription))
    .setVersion(version)
    .addTag('AdminPanel [Core]')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      `https://${NGINX_HOST}`,
      `https://www.${NGINX_HOST}`,
      `https://nuxt.${NGINX_HOST}`,
      `https://api.${NGINX_HOST}`,
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: 400,
    }),
  );
  await app.listen(PORT, HOST);
}
bootstrap();
