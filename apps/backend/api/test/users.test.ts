import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { adminCookies, app, userCookies, wrongValue } from './app.setup';
import {
  IGetListResponse,
  IQueryItems,
  IRole,
  IUser,
  IUsersRoles,
  TCreateUser,
  TGetListRequest,
  TGetUsers,
  TUpdateUser,
} from '@ap/shared/src/types';
import { ROUTES } from '@ap/shared/src/libs';

const runUsersTests = () => {
  describe('Users', () => {
    let entity: IUser;

    describe('Create', () => {
      const createEntity: TCreateUser = {
        name: 'Test',
        email: 'test0@mail.com',
        password: '!Q1q2w3e4rr4e3w2q1Q!',
        enabled: true,
      };

      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post(ROUTES.api.users)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .send({ ...createEntity, enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const createResBody = await request(app.getHttpServer())
          .post(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .send(createEntity)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IUser);

        expect(createResBody).toHaveProperty('id');
        expect(createResBody).toHaveProperty('name', createResBody.name);
        expect(createResBody).toHaveProperty('email', createEntity.email);
        expect(createResBody).toHaveProperty('enabled', createEntity.enabled);

        entity = createResBody;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post(ROUTES.api.users)
          .set('Cookie', userCookies)
          .send(createEntity)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get List', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.users)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        let getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            reqCount: true,
          } satisfies TGetListRequest<TGetUsers>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IUser>);

        expect(getListResBody).toHaveProperty('count', 3);
        expect(getListResBody).toHaveProperty('page', 1);
        expect(getListResBody).toHaveProperty('limit', 1);

        getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .query({
            reqLimit: 1,
            reqPage: 1,
            email: 'test0',
          } satisfies TGetListRequest<TGetUsers>)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IUser>);

        expect(getListResBody.rows).toHaveProperty('length', 1);
        expect(getListResBody.rows[0]).toHaveProperty('email', entity.email);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.users)
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Get One', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.user(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .get(ROUTES.api.user(wrongValue))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getOneResBody).toHaveProperty('id', entity.id);
        expect(getOneResBody).toHaveProperty('name', entity.name);
        expect(getOneResBody).toHaveProperty('email', entity.email);
        expect(getOneResBody).toHaveProperty('enabled', entity.enabled);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .get(ROUTES.api.user(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.user(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .send({ enabled: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.user(wrongValue))
          .set('Cookie', adminCookies)
          .send({ enabled: true } satisfies TUpdateUser)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .send({
            name: entity.name + entity.name,
          } satisfies TUpdateUser)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getOneResBody).toHaveProperty('name', entity.name);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.user(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Update Roles', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.userRoles(entity.id))
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch(ROUTES.api.userRoles(entity.id))
          .set('Cookie', adminCookies)
          .send({ test: wrongValue })
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .patch(ROUTES.api.userRoles(wrongValue))
          .set('Cookie', adminCookies)
          .send({ items: [] } satisfies IQueryItems<IUsersRoles>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        const getListResBody = await request(app.getHttpServer())
          .get(ROUTES.api.roles)
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IGetListResponse<IRole>);

        const role = getListResBody.rows[1];

        await request(app.getHttpServer())
          .patch(ROUTES.api.userRoles(entity.id))
          .set('Cookie', adminCookies)
          .send({
            items: [{ roleId: role.id, userId: entity.id }],
          } satisfies IQueryItems<IUsersRoles>)
          .expect(HttpStatus.NO_CONTENT);

        entity.name = entity.name + entity.name;

        const getOneResBody = await request(app.getHttpServer())
          .get(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getOneResBody.roles).toBeDefined();
        expect(getOneResBody.roles).toHaveProperty('length', 1);
        expect(getOneResBody.roles![0]).toHaveProperty('id', role.id);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.userRoles(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe('Delete', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.api.users)
          .send({ items: [entity.id] } satisfies IQueryItems<IUser['id']>)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .send({ items: [wrongValue] } satisfies IQueryItems<IUser['id']>)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete(ROUTES.api.users)
          .set('Cookie', adminCookies)
          .send({ items: [entity.id] } satisfies IQueryItems<IUser['id']>)
          .expect(HttpStatus.NO_CONTENT);

        await request(app.getHttpServer())
          .get(ROUTES.api.user(entity.id))
          .set('Cookie', adminCookies)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch(ROUTES.api.user(entity.id))
          .set('Cookie', userCookies)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
};
export default runUsersTests;
