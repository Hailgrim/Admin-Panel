import { createApi } from '@reduxjs/toolkit/query/react';

import {
  IResetPassword,
  IUser,
  IUserSignIn,
  IUserSignUp,
  IVerifyUser,
} from '@/lib/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import authService from '@/services/authService';

const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signUp: builder.query<IUser, IUserSignUp>({
      query: authService.signUpArgs,
    }),

    signIn: builder.query<IUser, IUserSignIn>({
      query: authService.signInArgs,
    }),

    verifyUser: builder.query<boolean, IVerifyUser>({
      query: authService.verifyUserArgs,
    }),

    forgotPassword: builder.query<boolean, string>({
      query: authService.forgotPasswordArgs,
    }),

    resetPassword: builder.query<boolean, IResetPassword>({
      query: authService.resetPasswordArgs,
    }),

    refresh: builder.query<boolean, void>({
      query: authService.refreshArgs,
    }),

    getProfile: builder.query<IUser, void>({
      query: authService.getProfileArgs,
    }),

    updateProfile: builder.mutation<boolean, Partial<IUser>>({
      query: authService.updateProfileArgs,
    }),

    signOut: builder.mutation<boolean, void>({
      query: authService.signOutArgs,
    }),
  }),
});

export default authApi;
