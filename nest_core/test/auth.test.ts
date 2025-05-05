import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';

import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import {
  admin,
  adminCookies,
  app,
  queue,
  user,
  userCookies,
  wrongValue,
} from './app.setup';
import { IUser } from 'src/users/users.types';
import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  IVerifyUser,
  TSignUp,
} from 'src/auth/auth.types';

const runAuthTests = () => {
  describe('Auth', () => {
    describe('Sign Up', () => {
      it('Incorrect (admin)', async () => {
        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({ ...admin, name: wrongValue } satisfies SignUpDto)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({ ...admin, email: wrongValue } satisfies SignUpDto)
          .expect(HttpStatus.BAD_REQUEST);

        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({ ...admin, password: wrongValue } satisfies SignUpDto)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        const signUpResBody = await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send(admin)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IUser);

        expect(signUpResBody.name).toBe(admin.name);
        expect(signUpResBody.email).toBe(admin.email);
        expect(signUpResBody.enabled).toBe(true);
        expect(signUpResBody.verified).toBe(false);
        expect(signUpResBody.roles![0].admin).toBe(true);
      });

      it('Incorrect (user)', async () => {
        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({ ...user, email: admin.email } satisfies TSignUp)
          .expect(HttpStatus.CONFLICT);
      });

      it('Correct (user)', async () => {
        const signUpResBody = await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send(user)
          .expect(HttpStatus.CREATED)
          .then((res) => res.body as IUser);

        expect(signUpResBody.name).toBe(user.name);
        expect(signUpResBody.email).toBe(user.email);
        expect(signUpResBody.enabled).toBe(true);
        expect(signUpResBody.verified).toBe(false);
        expect(signUpResBody.roles![0].admin).toBe(false);
      });
    });

    describe('Verify User request', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: wrongValue,
            password: admin.password,
          } satisfies ISignIn)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: admin.email,
            password: wrongValue,
          } satisfies ISignIn)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: admin.email,
            password: admin.password,
          } satisfies ISignIn)
          .expect(HttpStatus.FORBIDDEN);

        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', admin.email);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: user.email,
            password: user.password,
          } satisfies ISignIn)
          .expect(HttpStatus.FORBIDDEN);

        expect(queue.at(-1)).toHaveProperty('code');
        expect(queue.at(-1)).toHaveProperty('email', user.email);
      });
    });

    describe('Verify User', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/auth/verify-user')
          .send({
            code: wrongValue,
            email: queue.at(-1)!.email,
          } satisfies IVerifyUser)
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .post('/auth/verify-user')
          .send({
            code: queue.at(-1)!.code,
            email: wrongValue,
          } satisfies IVerifyUser)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .post('/auth/verify-user')
          .send({
            code: queue.at(-2)!.code,
            email: queue.at(-2)!.email,
          } satisfies IVerifyUser)
          .expect(HttpStatus.OK);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post('/auth/verify-user')
          .send({
            code: queue.at(-1)!.code,
            email: queue.at(-1)!.email,
          } satisfies IVerifyUser)
          .expect(HttpStatus.OK);
      });
    });

    describe('Forgot Password', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/auth/forgot-password')
          .send({ email: wrongValue } satisfies IForgotPassword)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('Correct (admin)', async () => {
        await request(app.getHttpServer())
          .post('/auth/forgot-password')
          .send({ email: admin.email } satisfies IForgotPassword)
          .expect(HttpStatus.OK);

        expect(queue.at(-1)).toHaveProperty('email', admin.email);
      });

      it('Correct (user)', async () => {
        await request(app.getHttpServer())
          .post('/auth/forgot-password')
          .send({ email: user.email } satisfies IForgotPassword)
          .expect(HttpStatus.OK);

        expect(queue.at(-1)).toHaveProperty('email', user.email);
      });
    });

    describe('Reset Password', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send({
            code: wrongValue,
            email: queue.at(-2)!.email,
            password: admin.password + admin.password,
          } satisfies IResetPassword)
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send({
            code: queue.at(-2)!.code,
            email: wrongValue,
            password: admin.password + admin.password,
          } satisfies IResetPassword)
          .expect(HttpStatus.NOT_FOUND);

        await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send({
            code: queue.at(-2)!.code,
            email: queue.at(-2)!.email,
            password: wrongValue,
          } satisfies IResetPassword)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Correct (admin)', async () => {
        admin.password = admin.password + admin.password;

        await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send({
            code: queue.at(-2)!.code,
            email: queue.at(-2)!.email,
            password: admin.password,
          } satisfies IResetPassword)
          .expect(HttpStatus.OK);
      });

      it('Correct (user)', async () => {
        user.password = user.password + user.password;

        await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send({
            code: queue.at(-1)!.code,
            email: queue.at(-1)!.email,
            password: user.password,
          } satisfies IResetPassword)
          .expect(HttpStatus.OK);
      });
    });

    describe('Sign In', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: wrongValue,
            password: admin.password,
          } satisfies ISignIn)
          .expect(HttpStatus.UNAUTHORIZED);

        await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: admin.email,
            password: wrongValue,
          } satisfies ISignIn)
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const signInRes = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: admin.email,
            password: admin.password,
          } satisfies ISignIn)
          .expect(HttpStatus.CREATED);

        expect(signInRes.headers).toHaveProperty('set-cookie');

        const resBody = signInRes.body as IUser;

        expect(resBody).toHaveProperty('id');
        expect(resBody).toHaveProperty('name', admin.name);
        expect(resBody).toHaveProperty('email', admin.email);
        expect(resBody).not.toHaveProperty('password');

        adminCookies.push(...signInRes.headers['set-cookie']);
      });

      it('Correct (user)', async () => {
        const signInRes = await request(app.getHttpServer())
          .post('/auth/sign-in')
          .send({
            username: user.email,
            password: user.password,
          } satisfies ISignIn)
          .expect(HttpStatus.CREATED);

        const resBody = signInRes.body as IUser;

        expect(resBody).toHaveProperty('id');
        expect(resBody).toHaveProperty('name', user.name);
        expect(resBody).toHaveProperty('email', user.email);
        expect(resBody).not.toHaveProperty('password');
        expect(signInRes.headers).toHaveProperty('set-cookie');

        userCookies.push(...signInRes.headers['set-cookie']);
      });
    });

    describe('Refresh', () => {
      it('Incorrect', async () => {
        await request(app.getHttpServer())
          .get('/auth/refresh')
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Correct (admin)', async () => {
        const refreshRes = await request(app.getHttpServer())
          .get('/auth/refresh')
          .set('Cookie', adminCookies)
          .expect(HttpStatus.OK);

        expect(refreshRes.headers).toHaveProperty('set-cookie');

        adminCookies.length = 0;
        adminCookies.push(...refreshRes.headers['set-cookie']);
      });

      it('Correct (user)', async () => {
        const refreshRes = await request(app.getHttpServer())
          .get('/auth/refresh')
          .set('Cookie', userCookies)
          .expect(HttpStatus.OK);

        expect(refreshRes.headers).toHaveProperty('set-cookie');

        userCookies.length = 0;
        userCookies.push(...refreshRes.headers['set-cookie']);
      });
    });
  });
};
export default runAuthTests;
