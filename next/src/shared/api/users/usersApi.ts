import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReauth from '../baseQueryWithReauth';
import usersService from '@/shared/api/users/usersService';
import { IUser, IUserCreate } from './types';
import { IFindAndCountRes, IListReq, IUpdateReq } from '../types';
import { IUsersRoles } from '../roles/types';

const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IUser, IUserCreate>({
      query: usersService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    findAll: builder.query<IUser[], IListReq<IUser> | void>({
      query: usersService.findAllArgs,
      providesTags: ['Entities'],
    }),

    findAndCountAll: builder.query<
      IFindAndCountRes<IUser>,
      IListReq<IUser> | void
    >({
      query: usersService.findAndCountAllArgs,
      providesTags: ['CountedEntities'],
    }),

    findOne: builder.query<IUser, number>({
      query: usersService.findOneArgs,
      providesTags: ['Entity'],
    }),

    update: builder.mutation<boolean, IUpdateReq<IUser>>({
      query: usersService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    updateRoles: builder.mutation<boolean, IUpdateReq<IUsersRoles[]>>({
      query: usersService.updateRolesArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<boolean, number | number[]>({
      query: usersService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default usersApi;
