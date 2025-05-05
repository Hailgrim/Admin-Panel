import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReauth from '../baseQueryWithReauth';
import usersService from '@/shared/api/users/usersService';
import { IUser, TCreateUser, TGetUsers, TUpdateUser } from './types';
import {
  IGetListResponse,
  TGetListRequest,
  IUpdateReq,
  IUsersRoles,
  IQueryItems,
} from '../types';

const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IUser, TCreateUser>({
      query: usersService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    findAll: builder.query<
      IGetListResponse<IUser>,
      TGetListRequest<TGetUsers> | void
    >({
      query: usersService.findAllArgs,
      providesTags: ['Entities'],
    }),

    findOne: builder.query<IUser, IUser['id']>({
      query: usersService.findOneArgs,
      providesTags: ['Entity'],
    }),

    update: builder.mutation<boolean, IUpdateReq<TUpdateUser, IUser['id']>>({
      query: usersService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    updateRoles: builder.mutation<
      boolean,
      IUpdateReq<IUsersRoles[], IUser['id']>
    >({
      query: usersService.updateRolesArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<boolean, IQueryItems<IUser['id']>>({
      query: usersService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default usersApi;
