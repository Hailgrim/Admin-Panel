import { createApi } from '@reduxjs/toolkit/query/react';

import profileService from '@/shared/api/profile/profileService';
import baseQueryWithReprofile from '../baseQueryWithReauth';
import {
  IChangeEmailConfirm,
  IChangeEmailRequest,
  TExternalSession,
  IQueryItems,
  IUpdatePassword,
  IUser,
  TUpdateUser,
} from '@ap/shared';

const profileApi = createApi({
  reducerPath: 'profile',
  baseQuery: baseQueryWithReprofile,
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: profileService.getProfileArgs,
    }),

    updateProfile: builder.mutation<undefined, TUpdateUser>({
      query: profileService.updateProfileArgs,
    }),

    updatePassword: builder.mutation<undefined, IUpdatePassword>({
      query: profileService.updatePasswordArgs,
    }),

    changeEmailRequest: builder.mutation<undefined, IChangeEmailRequest>({
      query: profileService.changeEmailRequestArgs,
    }),

    changeEmailConfirm: builder.mutation<undefined, IChangeEmailConfirm>({
      query: profileService.changeEmailConfirmArgs,
    }),

    getSessions: builder.query<TExternalSession[], void>({
      query: profileService.getSessionsArgs,
    }),

    deleteSessions: builder.mutation<
      undefined,
      IQueryItems<TExternalSession['id']>
    >({
      query: profileService.deleteSessionsArgs,
    }),
  }),
});

export default profileApi;
