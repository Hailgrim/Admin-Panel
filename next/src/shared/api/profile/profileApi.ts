import { createApi } from '@reduxjs/toolkit/query/react';

import profileService from '@/shared/api/profile/profileService';
import baseQueryWithReprofile from '../baseQueryWithReauth';
import { IUser } from '../users/types';
import { ISession, IUpdatePassword } from './types';

const profileApi = createApi({
  reducerPath: 'profile',
  baseQuery: baseQueryWithReprofile,
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: profileService.getProfileArgs,
    }),

    updateProfile: builder.mutation<boolean, Partial<IUser>>({
      query: profileService.updateProfileArgs,
    }),

    updatePassword: builder.mutation<boolean, IUpdatePassword>({
      query: profileService.updatePasswordArgs,
    }),

    changeEmailRequest: builder.mutation<boolean, string>({
      query: profileService.changeEmailRequestArgs,
    }),

    changeEmailConfirm: builder.mutation<boolean, string>({
      query: profileService.changeEmailConfirmArgs,
    }),

    getSessions: builder.query<ISession[], void>({
      query: profileService.getSessionsArgs,
    }),

    deleteSessions: builder.mutation<boolean, string[]>({
      query: profileService.deleteSessionsArgs,
    }),
  }),
});

export default profileApi;
