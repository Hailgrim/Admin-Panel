import { createApi } from '@reduxjs/toolkit/query/react';

import profileService from '@/shared/api/profile/profileService';
import baseQueryWithReprofile from '../baseQueryWithReauth';
import { IUser, TUpdateUser } from '../users/types';
import {
  IChangeEmail,
  IChangeEmailRequest,
  IExternalSession,
  IUpdatePassword,
} from './types';
import { IQueryItems } from '../types';

const profileApi = createApi({
  reducerPath: 'profile',
  baseQuery: baseQueryWithReprofile,
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: profileService.getProfileArgs,
    }),

    updateProfile: builder.mutation<boolean, TUpdateUser>({
      query: profileService.updateProfileArgs,
    }),

    updatePassword: builder.mutation<boolean, IUpdatePassword>({
      query: profileService.updatePasswordArgs,
    }),

    changeEmailRequest: builder.mutation<boolean, IChangeEmailRequest>({
      query: profileService.changeEmailRequestArgs,
    }),

    changeEmail: builder.mutation<boolean, IChangeEmail>({
      query: profileService.changeEmailArgs,
    }),

    getSessions: builder.query<IExternalSession[], void>({
      query: profileService.getSessionsArgs,
    }),

    deleteSessions: builder.mutation<
      boolean,
      IQueryItems<IExternalSession['id']>
    >({
      query: profileService.deleteSessionsArgs,
    }),
  }),
});

export default profileApi;
