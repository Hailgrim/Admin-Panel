import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import {
  admin,
  adminCookies,
  app,
  queue,
  user,
  userCookies,
  wrongValue,
} from './app.setup';
import { IUser, TUpdateUser } from 'src/users/users.types';
import {
  IChangeEmail,
  IChangeEmailRequest,
  IExternalSession,
  IUpdatePassword,
} from 'src/profile/profile.types';
import { IQueryItems } from 'src/database/database.types';
import { ISignIn } from 'src/auth/auth.types';

const runProfileTests = () => {
  describe('Profile', () => {
    describe('Get Profile', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get('/profile')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const getProfileResBody = await request(app.getHttpServer())
          .get('/profile')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getProfileResBody).toHaveProperty('id');
        expect(getProfileResBody).toHaveProperty('name', admin.name);
        expect(getProfileResBody).toHaveProperty('email', admin.email);
        expect(getProfileResBody).not.toHaveProperty('password');
      });

      it('Correct (user)', async () => {
        const getProfileResBody = await request(app.getHttpServer())
          .get('/profile')
          .set('Cookie', userCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getProfileResBody).toHaveProperty('id');
        expect(getProfileResBody).toHaveProperty('name', user.name);
        expect(getProfileResBody).toHaveProperty('email', user.email);
        expect(getProfileResBody).not.toHaveProperty('password');
      });
    });

    describe('Update Profile', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch('/profile')
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch('/profile')
          .set('Cookie', adminCookies)
          .send({ password: admin.password })
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .patch('/profile')
          .set('Cookie', adminCookies)
          .send({ name: wrongValue } satisfies TUpdateUser)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch('/profile')
          .set('Cookie', adminCookies)
          .send({ name: admin.name } satisfies TUpdateUser)
          .expect(HttpStatus.OK);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch('/profile')
          .set('Cookie', userCookies)
          .send({ name: user.name } satisfies TUpdateUser)
          .expect(HttpStatus.OK);
      });
    });

    describe('Update Password', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch('/profile/update-password')
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .patch('/profile/update-password')
          .set('Cookie', adminCookies)
          .send({
            oldPassword: wrongValue,
            newPassword: admin.password + admin.password,
          } satisfies IUpdatePassword)
          .expect(HttpStatus.CONFLICT);

        await request(app.getHttpServer())
          .patch('/profile/update-password')
          .set('Cookie', adminCookies)
          .send({
            oldPassword: admin.password,
            newPassword: wrongValue,
          } satisfies IUpdatePassword)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch('/profile/update-password')
          .set('Cookie', adminCookies)
          .send({
            oldPassword: admin.password,
            newPassword: admin.password + admin.password,
          } satisfies IUpdatePassword)
          .expect(HttpStatus.OK);

        admin.password = admin.password + admin.password;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch('/profile/update-password')
          .set('Cookie', userCookies)
          .send({
            oldPassword: user.password,
            newPassword: user.password + user.password,
          } satisfies IUpdatePassword)
          .expect(HttpStatus.OK);

        user.password = user.password + user.password;
      });
    });

    describe('Change Email request', () => {
      const newAdminEmail = 'test3@test.com';
      const newUserEmail = 'test4@test.com';

      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/profile/change-email')
          .send({ newEmail: newAdminEmail } satisfies IChangeEmailRequest)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post('/profile/change-email')
          .set('Cookie', adminCookies)
          .send({ newEmail: wrongValue } satisfies IChangeEmailRequest)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .post('/profile/change-email')
          .set('Cookie', adminCookies)
          .send({ newEmail: newAdminEmail } satisfies IChangeEmailRequest)
          .expect(HttpStatus.OK);

        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', newAdminEmail);
        admin.email = newAdminEmail;
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post('/profile/change-email')
          .set('Cookie', userCookies)
          .send({ newEmail: newUserEmail } satisfies IChangeEmailRequest)
          .expect(HttpStatus.OK);

        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', newUserEmail);
        user.email = newUserEmail;
      });
    });

    describe('Change Email', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .patch('/profile/change-email')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .patch('/profile/change-email')
          .set('Cookie', adminCookies)
          .send({ code: queue.at(-2)!.code } satisfies IChangeEmail)
          .expect(HttpStatus.OK);

        const getProfileResBody = await request(app.getHttpServer())
          .get('/profile')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getProfileResBody).toHaveProperty('email', admin.email);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .patch('/profile/change-email')
          .set('Cookie', userCookies)
          .send({ code: queue.at(-1)!.code } satisfies IChangeEmail)
          .expect(HttpStatus.OK);

        const getProfileResBody = await request(app.getHttpServer())
          .get('/profile')
          .set('Cookie', userCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IUser);

        expect(getProfileResBody).toHaveProperty('email', user.email);
      });
    });

    let adminSession: IExternalSession;
    let userSession: IExternalSession;

    describe('Get Sessions', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get('/profile/sessions')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const getSessionsResBody = await request(app.getHttpServer())
          .get('/profile/sessions')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IExternalSession[]);

        expect(getSessionsResBody[0]).toHaveProperty('id');
        expect(getSessionsResBody[0]).toHaveProperty('current', true);
        expect(getSessionsResBody[0]).toHaveProperty('ip');
        expect(getSessionsResBody[0]).toHaveProperty('updatedAt');
        adminSession = getSessionsResBody[0];
      });

      it('Correct (user)', async () => {
        const getSessionsResBody = await request(app.getHttpServer())
          .get('/profile/sessions')
          .set('Cookie', userCookies)
          .expect(HttpStatus.OK)
          .then((res) => res.body as IExternalSession[]);

        expect(getSessionsResBody[0]).toHaveProperty('id');
        expect(getSessionsResBody[0]).toHaveProperty('current', true);
        expect(getSessionsResBody[0]).toHaveProperty('ip');
        expect(getSessionsResBody[0]).toHaveProperty('updatedAt');
        userSession = getSessionsResBody[0];
      });
    });

    describe('Delete Sessions', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .delete('/profile/sessions')
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .delete('/profile/sessions')
          .set('Cookie', adminCookies)
          .send({})
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .delete('/profile/sessions')
          .set('Cookie', adminCookies)
          .send({ items: [adminSession.id] } satisfies IQueryItems<
            IExternalSession['id']
          >)
          .expect(HttpStatus.OK);

        adminCookies.shift();

        await request(app.getHttpServer())
          .get('/profile')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.UNAUTHORIZED);

        const signInRes = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: admin.email,
            password: admin.password,
          } satisfies ISignIn)
          .expect(HttpStatus.CREATED);

        adminCookies.length = 0;
        adminCookies.push(...signInRes.headers['set-cookie']);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .delete('/profile/sessions')
          .set('Cookie', userCookies)
          .send({ items: [userSession.id] } satisfies IQueryItems<
            IExternalSession['id']
          >)
          .expect(HttpStatus.OK);

        userCookies.shift();

        await request(app.getHttpServer())
          .get('/profile')
          .set('Cookie', userCookies)
          .expect(HttpStatus.UNAUTHORIZED);

        const signInRes = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: user.email,
            password: user.password,
          } satisfies ISignIn)
          .expect(HttpStatus.CREATED);

        userCookies.length = 0;
        userCookies.push(...signInRes.headers['set-cookie']);
      });
    });
  });
};
export default runProfileTests;
