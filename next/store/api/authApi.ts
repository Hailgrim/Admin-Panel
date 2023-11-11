import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import {
  ICookies,
  IResetPassword,
  IUser,
  IUserSignIn,
  IUserSignUp,
  IVerifyUser,
} from '../../lib/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import { ROUTES } from '../../lib/constants';

const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: builder => ({

    signUp: builder.query<IUser, IUserSignUp>({
      query: payload => ({
        url: ROUTES.api.auth.sighUp,
        method: 'POST',
        body: payload,
      }),
    }),

    signIn: builder.query<IUser, IUserSignIn>({
      query: payload => ({
        url: ROUTES.api.auth.signIn,
        method: 'POST',
        credentials: 'include',
        body: payload,
      }),
    }),

    verifyUser: builder.query<boolean, IVerifyUser>({
      query: payload => ({
        url: ROUTES.api.auth.verify,
        method: 'POST',
        body: payload,
      }),
    }),

    forgotPassword: builder.query<boolean, string>({
      query: payload => ({
        url: ROUTES.api.auth.forgotPassword,
        method: 'POST',
        body: payload,
      }),
    }),

    resetPassword: builder.query<boolean, IResetPassword>({
      query: payload => ({
        url: ROUTES.api.auth.resetPassword,
        method: 'POST',
        body: payload,
      }),
    }),

    refresh: builder.query<ICookies, void>({
      query: () => ({
        url: ROUTES.api.auth.refresh,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getProfile: builder.query<IUser, void>({
      query: () => ({
        url: ROUTES.api.auth.profile,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    updateProfile: builder.mutation<boolean, Partial<IUser>>({
      query: payload => ({
        url: ROUTES.api.auth.profile,
        method: 'PATCH',
        credentials: 'include',
        body: payload,
      }),
    }),

    signOut: builder.mutation<boolean, void>({
      query: () => ({
        url: ROUTES.api.auth.signOut,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),

  }),
});

export default authApi;
