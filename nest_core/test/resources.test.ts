import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongValue } from './app.setup';
import {
  IGetListResponse,
  IQueryItems,
  TGetListRequest,
  IResource,
  TCreateResource,
  TGetResources,
  TUpdateResource,
  ROUTES,
} from '@ap/shared';

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
          .post(ROUTES.api.resources)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .send({ ...createEntity, enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post(ROUTES.api.resources)
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
          .post(ROUTES.api.resources)
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get List', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.resources)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetResources>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IResource>);

        expect(getListResBody).toHaveProperty('count', 5);
        expect(getListResBody).toHaveProperty('page', 1);
        expect(getListResBody).toHaveProperty('limit', 1);

        getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            path: 'te',
          } satisfies TGetListRequest<TGetResources>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IResource>);

        expect(getListResBody.rows).toHaveProperty('length', 1);
        expect(getListResBody.rows[0]).toHaveProperty('path', entity.path);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.resources)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.resource(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(ROUTES.api.resource(wrongValue))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IResource);

        expect(getOneResBody).toHaveProperty('id', entity.id);
        expect(getOneResBody).toHaveProperty('name', entity.name);
        expect(getOneResBody).toHaveProperty('path', entity.path);
        expect(getOneResBody).toHaveProperty('description', entity.description);
        expect(getOneResBody).toHaveProperty('enabled', entity.enabled);
        expect(getOneResBody).toHaveProperty('default', entity.default);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.resource(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(entity.id))
          .set('Cookie', adminCookies)
          .send({ enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(wrongValue))
          .set('Cookie', adminCookies)
          .send({ enabled: true } satisfies TUpdateResource)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(entity.id))
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TUpdateResource)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IResource);

        expect(getOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.api.resources)
          .send({ items: [entity.id] } satisfies IQueryItems<IResource['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .send({ items: [wrongValue] } satisfies IQueryItems<IResource['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IQueryItems<IResource['id']>)
          .expect(HttpStatus.NO_CONTENT);

        await request(app.getHttpServer())
          .get(ROUTES.api.resource(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.resource(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
export default runResourcesTests;
