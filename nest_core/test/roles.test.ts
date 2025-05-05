import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongValue } from './app.setup';
import {
  IRole,
  TCreateRole,
  TGetRoles,
  TUpdateRole,
} from 'src/roles/roles.types';
import {
  IGetListResponse,
  IQueryItems,
  IRights,
  TGetListRequest,
} from 'src/database/database.types';
import { IResource, TGetResources } from 'src/resources/resources.types';

const runRolesTests = () => {
  describe('Roles', () => {
    let entity: IRole;

    describe('Create', () => {
      const createEntity: TCreateRole = {
        name: 'Test',
        description: 'Test entity',
        enabled: true,
      };

      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/roles')
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post('/roles')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post('/roles')
          .set('Cookie', adminCookies)
          .send({ ...createEntity, enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post('/roles')
          .set('Cookie', adminCookies)
          .send(createEntity)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IRole);

        expect(createResBody).toHaveProperty('id');
        expect(createResBody).toHaveProperty('name', createResBody.name);
        expect(createResBody).toHaveProperty(
          'description',
          createEntity.description,
        );
        expect(createResBody).toHaveProperty('enabled', createEntity.enabled);
        expect(createResBody).toHaveProperty('default', false);
        expect(createResBody).toHaveProperty('admin', false);

        entity = createResBody;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post('/roles')
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Find All', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get('/roles')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let findAllResBody = await request(app.getHttpServer())
          .get('/roles')
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetRoles>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IRole>);

        expect(findAllResBody).toHaveProperty('count', 3);

        findAllResBody = await request(app.getHttpServer())
          .get('/roles')
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            name: 'te',
          } satisfies TGetListRequest<TGetRoles>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IRole>);

        expect(findAllResBody.rows).toHaveProperty('length', 1);
        expect(findAllResBody.rows[0]).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get('/roles')
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Find One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(`/roles/${entity.id}`)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(`/roles/${wrongValue}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const findOneResBody = await request(app.getHttpServer())
          .get(`/roles/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(findOneResBody).toHaveProperty('id', entity.id);
        expect(findOneResBody).toHaveProperty('name', entity.name);
        expect(findOneResBody).toHaveProperty(
          'description',
          entity.description,
        );
        expect(findOneResBody).toHaveProperty('enabled', entity.enabled);
        expect(findOneResBody).toHaveProperty('default', entity.default);
        expect(findOneResBody).toHaveProperty('admin', entity.admin);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(`/roles/${entity.id}`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}`)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(`/roles/${wrongValue}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .patch(`/roles/${wrongValue}`)
          .set('Cookie', adminCookies)
          .send({ enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}`)
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TUpdateRole)
          .expect(HttpStatus.OK);

        entity.name = entity.name + entity.name;

        const findOneResBody = await request(app.getHttpServer())
          .get(`/roles/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(findOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update Resources', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}/resources`)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(`/roles/${wrongValue}/resources`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}/resources`)
          .set('Cookie', adminCookies)
          .send([{ test: wrongValue }])
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const findAllResBody = await request(app.getHttpServer())
          .get('/resources')
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetResources>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IResource>);

        const resource = findAllResBody.rows[0];

        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}/resources`)
          .set('Cookie', adminCookies)
          .send({
            items: [
              {
                roleId: entity.id,
                resourceId: resource.id,
                creating: true,
                reading: true,
                updating: false,
                deleting: false,
              },
            ],
          } satisfies IQueryItems<IRights>)
          .expect(HttpStatus.OK);

        entity.name = entity.name + entity.name;

        const findOneResBody = await request(app.getHttpServer())
          .get(`/roles/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(findOneResBody.resources).toBeDefined();
        expect(findOneResBody.resources).toHaveProperty('length', 1);
        expect(findOneResBody.resources![0]).toHaveProperty('id', resource.id);
        expect(findOneResBody.resources![0].RightsModel).toHaveProperty(
          'creating',
          true,
        );
        expect(findOneResBody.resources![0].RightsModel).toHaveProperty(
          'reading',
          true,
        );
        expect(findOneResBody.resources![0].RightsModel).toHaveProperty(
          'updating',
          false,
        );
        expect(findOneResBody.resources![0].RightsModel).toHaveProperty(
          'deleting',
          false,
        );
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}/resources`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete('/roles')
          .send({ items: [entity.id] } satisfies IQueryItems<IRole['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete('/roles')
          .set('Cookie', adminCookies)
          .send({ items: [wrongValue] } satisfies IQueryItems<IRole['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete('/roles')
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IQueryItems<IRole['id']>)
          .expect(HttpStatus.OK);

        await request(app.getHttpServer())
          .get(`/roles/${entity.id}`)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(`/roles/${entity.id}`)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
export default runRolesTests;
