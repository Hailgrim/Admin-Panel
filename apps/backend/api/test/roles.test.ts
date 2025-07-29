import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import {
  adminCookies,
  app,
  userCookies,
  wrongId,
  wrongValue,
} from './app.setup';
import {
  IGetListResponse,
  IQueryItems,
  IResource,
  IRights,
  IRole,
  TCreateRole,
  TGetListRequest,
  TGetRoles,
  TUpdateRole,
} from '@ap/shared/src/types';
import { ROUTES } from '@ap/shared/src/libs';

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
          .post(ROUTES.api.roles)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .send({ ...createEntity, enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post(ROUTES.api.roles)
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
          .post(ROUTES.api.roles)
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get List', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.roles)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetRoles>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IRole>);

        expect(getListResBody).toHaveProperty('count', 3);
        expect(getListResBody).toHaveProperty('page', 1);
        expect(getListResBody).toHaveProperty('limit', 1);

        getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            name: 'te',
          } satisfies TGetListRequest<TGetRoles>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IRole>);

        expect(getListResBody.rows).toHaveProperty('length', 1);
        expect(getListResBody.rows[0]).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.roles)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(ROUTES.api.role(wrongId))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(getOneResBody).toHaveProperty('id', entity.id);
        expect(getOneResBody).toHaveProperty('name', entity.name);
        expect(getOneResBody).toHaveProperty('description', entity.description);
        expect(getOneResBody).toHaveProperty('enabled', entity.enabled);
        expect(getOneResBody).toHaveProperty('default', entity.default);
        expect(getOneResBody).toHaveProperty('admin', entity.admin);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.role(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .send({ enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.role(wrongId))
          .set('Cookie', adminCookies)
          .send({ enabled: true } satisfies TUpdateRole)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TUpdateRole)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(getOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.role(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update Resources', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.roleRights(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.api.roleRights(entity.id))
          .set('Cookie', adminCookies)
          .send({ test: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.roleRights(wrongId))
          .set('Cookie', adminCookies)
          .send({ items: [] } satisfies IQueryItems<IRights>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.resources)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IResource>);

        const resource = getListResBody.rows[0];

        await request(app.getHttpServer())
          .patch(ROUTES.api.roleRights(entity.id))
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
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(getOneResBody.rights).toBeDefined();
        expect(getOneResBody.rights).toHaveProperty('length', 1);
        expect(getOneResBody.rights![0]).toHaveProperty(
          'resourceId',
          resource.id,
        );
        expect(getOneResBody.rights![0]).toHaveProperty('creating', true);
        expect(getOneResBody.rights![0]).toHaveProperty('reading', true);
        expect(getOneResBody.rights![0]).toHaveProperty('updating', false);
        expect(getOneResBody.rights![0]).toHaveProperty('deleting', false);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.roleRights(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.api.roles)
          .send({ items: [entity.id] } satisfies IQueryItems<IRole['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .send({ items: [wrongId] } satisfies IQueryItems<IRole['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IQueryItems<IRole['id']>)
          .expect(HttpStatus.NO_CONTENT);

        await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.role(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
export default runRolesTests;
