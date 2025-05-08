import { createApi } from '@reduxjs/toolkit/query/react';

import authService from '@/shared/api/auth/authService';
import baseQueryWithReauth from '../baseQueryWithReauth';
import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  ISignInGoogle,
  IUser,
  IVerifyUser,
  TSignUp,
} from '@ap/shared';

const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signUp: builder.query<IUser, TSignUp>({
      query: authService.signUpArgs,
    }),

    forgotPassword: builder.query<boolean, IForgotPassword>({
      query: authService.forgotPasswordArgs,
    }),

    resetPassword: builder.query<boolean, IResetPassword>({
      query: authService.resetPasswordArgs,
    }),

    verifyUser: builder.query<boolean, IVerifyUser>({
      query: authService.verifyUserArgs,
    }),

    signIn: builder.query<IUser, ISignIn>({
      query: authService.signInArgs,
    }),

    signInGoogle: builder.query<IUser, ISignInGoogle>({
      query: authService.signInGoogleArgs,
    }),

    refresh: builder.query<boolean, void>({
      query: authService.refreshArgs,
    }),

    signOut: builder.mutation<boolean, void>({
      query: authService.signOutArgs,
    }),
  }),
});

export default authApi;
