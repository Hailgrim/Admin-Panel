import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongValue } from './app.setup';
import {
  IRole,
  TCreateRole,
  TGetRoles,
  TUpdateRole,
  IGetListResponse,
  IQueryItems,
  IRights,
  TGetListRequest,
  IResource,
  TGetResources,
  ROUTES,
} from '@ap/shared';

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
        let findAllResBody = await request(app.getHttpServer())
          .get(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetRoles>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IRole>);

        expect(findAllResBody).toHaveProperty('count', 3);
        expect(findAllResBody).toHaveProperty('page', 1);
        expect(findAllResBody).toHaveProperty('limit', 1);

        findAllResBody = await request(app.getHttpServer())
          .get(ROUTES.api.roles)
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
          .get(ROUTES.api.role(wrongValue))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const findOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
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
          .patch(ROUTES.api.role(wrongValue))
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

        const findOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(findOneResBody).toHaveProperty('name', entity.name);
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
          .patch(ROUTES.api.roleRights(wrongValue))
          .set('Cookie', adminCookies)
          .send({ items: [] } satisfies IQueryItems<IRights>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const findAllResBody = await request(app.getHttpServer())
          .get(ROUTES.api.resources)
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

        const findOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.role(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IRole);

        expect(findOneResBody.rights).toBeDefined();
        expect(findOneResBody.rights).toHaveProperty('length', 1);
        expect(findOneResBody.rights![0]).toHaveProperty(
          'resourceId',
          resource.id,
        );
        expect(findOneResBody.rights![0]).toHaveProperty('creating', true);
        expect(findOneResBody.rights![0]).toHaveProperty('reading', true);
        expect(findOneResBody.rights![0]).toHaveProperty('updating', false);
        expect(findOneResBody.rights![0]).toHaveProperty('deleting', false);
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
          .send({ items: [wrongValue] } satisfies IQueryItems<IRole['id']>)
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
