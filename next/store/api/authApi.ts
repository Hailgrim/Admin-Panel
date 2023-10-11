import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import {
  ICookies,
  IResetPassword,
  IUpdateReq,
  IUser,
  IUserSignIn,
  IUserSignUp,
  IVerifyUser,
} from '../../libs/types';
import baseQueryWithReauth from '../baseQueryWithReauth';

const route = 'auth';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: builder => ({

    signUp: builder.query<IUser, IUserSignUp>({
      query: payload => ({
        url: `${route}/sign-up`,
        method: 'POST',
        body: payload,
      }),
    }),

    verifyUser: builder.query<boolean, IVerifyUser>({
      query: payload => ({
        url: `${route}/verify-user`,
        method: 'POST',
        body: payload,
      }),
    }),

    signIn: builder.query<IUser, IUserSignIn>({
      query: payload => ({
        url: `${route}/sign-in`,
        method: 'POST',
        credentials: 'include',
        body: payload,
      }),
    }),

    forgotPassword: builder.query<boolean, string>({
      query: payload => ({
        url: `${route}/forgot-password`,
        method: 'POST',
        body: payload,
      }),
    }),

    resetPassword: builder.query<boolean, IResetPassword>({
      query: payload => ({
        url: `${route}/reset-password`,
        method: 'POST',
        body: payload,
      }),
    }),

    refresh: builder.query<ICookies, void>({
      query: () => ({
        url: `${route}/refresh`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getProfile: builder.query<IUser, void>({
      query: () => ({
        url: `${route}/profile`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    updateProfile: builder.mutation<boolean, IUpdateReq<IUser>>({
      query: payload => ({
        url: `${route}/profile`,
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      }),
    }),

    signOut: builder.mutation<boolean, void>({
      query: () => ({
        url: `${route}/log-out`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),

  }),
});

export default authApi;
