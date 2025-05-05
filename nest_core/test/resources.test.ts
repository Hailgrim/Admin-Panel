import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongValue } from './app.setup';
import {
  IResource,
  TCreateResource,
  TGetResources,
  TUpdateResource,
} from 'src/resources/resources.types';
import {
  IGetListResponse,
  IQueryItems,
  TGetListRequest,
} from 'src/database/database.types';

const runResourcesTests = () => {
  describe('Resources', () => {
    let entity: IResource;

    describe('Create', () => {
      const createEntity: TCreateResource = {
        name: 'Test',
        path: 'test',
        description: 'Test entity',
        enabled: true,
      };

      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/resources')
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post('/resources')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post('/resources')
          .set('Cookie', adminCookies)
          .send({ ...createEntity, enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post('/resources')
          .set('Cookie', adminCookies)
          .send(createEntity)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IResource);

        expect(createResBody).toHaveProperty('id');
        expect(createResBody).toHaveProperty('name', createResBody.name);
        expect(createResBody).toHaveProperty('path', createEntity.path);
        expect(createResBody).toHaveProperty(
          'description',
          createEntity.description,
        );
        expect(createResBody).toHaveProperty('enabled', createEntity.enabled);
        expect(createResBody).toHaveProperty('default', false);

        entity = createResBody;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post('/resources')
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Find All', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get('/resources')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let findAllResBody = await request(app.getHttpServer())
          .get('/resources')
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetResources>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IResource>);

        expect(findAllResBody).toHaveProperty('count', 5);

        findAllResBody = await request(app.getHttpServer())
          .get('/resources')
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            path: 'te',
          } satisfies TGetListRequest<TGetResources>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IResource>);

        expect(findAllResBody.rows).toHaveProperty('length', 1);
        expect(findAllResBody.rows[0]).toHaveProperty('path', entity.path);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get('/resources')
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Find One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(`/resources/${entity.id}`)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(`/resources/${wrongValue}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const findOneResBody = await request(app.getHttpServer())
          .get(`/resources/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IResource);

        expect(findOneResBody).toHaveProperty('id', entity.id);
        expect(findOneResBody).toHaveProperty('name', entity.name);
        expect(findOneResBody).toHaveProperty('path', entity.path);
        expect(findOneResBody).toHaveProperty(
          'description',
          entity.description,
        );
        expect(findOneResBody).toHaveProperty('enabled', entity.enabled);
        expect(findOneResBody).toHaveProperty('default', entity.default);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(`/resources/${entity.id}`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(`/resources/${entity.id}`)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(`/resources/${wrongValue}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .patch(`/resources/${wrongValue}`)
          .set('Cookie', adminCookies)
          .send({ enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(`/resources/${entity.id}`)
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TUpdateResource)
          .expect(HttpStatus.OK);

        entity.name = entity.name + entity.name;

        const findOneResBody = await request(app.getHttpServer())
          .get(`/resources/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IResource);

        expect(findOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(`/resources/${entity.id}`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete('/resources')
          .send({ items: [entity.id] } satisfies IQueryItems<IResource['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete('/resources')
          .set('Cookie', adminCookies)
          .send({ items: [wrongValue] } satisfies IQueryItems<IResource['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete('/resources')
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IQueryItems<IResource['id']>)
          .expect(HttpStatus.OK);

        await request(app.getHttpServer())
          .get(`/resources/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(`/resources/${entity.id}`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
export default runResourcesTests;
