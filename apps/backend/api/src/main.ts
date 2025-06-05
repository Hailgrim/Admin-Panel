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
import { version, name } from '../package.json';
import { d } from '@ap/shared';
import { cfg } from 'config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true }),
  );

  await app.register(fastifyCookie);
  await app.register(fastifyHelmet);

  const config = new DocumentBuilder()
    .setTitle(d['en'].adminPanel)
    .setDescription(d['en'].adminPanelAPIDescription)
    .setVersion(version)
    .addTag(name)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.enableCors({
    origin: [
      `https://www.${cfg.urls.main}`,
      `https://${cfg.urls.panelReact}`,
      `https://${cfg.urls.panelVue}`,
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
    }),
  );

  await app.listen(cfg.port, cfg.host);
}
bootstrap();
