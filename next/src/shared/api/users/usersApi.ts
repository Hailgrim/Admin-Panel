import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReauth from '../baseQueryWithReauth';
import usersService from '@/shared/api/users/usersService';
import {
  IGetListResponse,
  IQueryItems,
  IUpdateReq,
  IUser,
  IUsersRoles,
  TCreateUser,
  TGetListRequest,
  TGetUsers,
  TUpdateUser,
} from '@ap/shared';

const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IUser, TCreateUser>({
      query: usersService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    getOne: builder.query<IUser, IUser['id']>({
      query: usersService.getOneArgs,
      providesTags: ['Entity'],
    }),

    getList: builder.query<
      IGetListResponse<IUser>,
      TGetListRequest<TGetUsers> | void
    >({
      query: usersService.getListArgs,
      providesTags: ['Entities'],
    }),

    update: builder.mutation<undefined, IUpdateReq<TUpdateUser, IUser['id']>>({
      query: usersService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    updateRoles: builder.mutation<
      undefined,
      IUpdateReq<IQueryItems<IUsersRoles>, IUser['id']>
    >({
      query: usersService.updateRolesArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<undefined, IQueryItems<IUser['id']>>({
      query: usersService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default usersApi;
