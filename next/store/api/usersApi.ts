import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import {
  IFindAndCountRes,
  IListReq,
  IUpdateReq,
  IUser,
  IUserCreate,
  IUsersRoles,
} from '../../lib/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import { ROUTES } from '../../lib/constants';

const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Entities'],
  endpoints: builder => ({

    create: builder.mutation<IUser, IUserCreate>({
      query: payload => ({
        url: ROUTES.api.users,
        method: 'POST',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Entities'],
    }),

    findAll: builder.query<IUser[], IListReq<IUser> | void>({
      query: payload => ({
        url: ROUTES.api.users,
        method: 'GET',
        credentials: 'include',
        params: payload || undefined,
      }),
      providesTags: ['Entities'],
    }),

    findAndCountAll: builder.query<IFindAndCountRes<IUser>, IListReq<IUser> | void>({
      query: payload => ({
        url: ROUTES.api.users,
        method: 'GET',
        credentials: 'include',
        params: { ...payload, count: true },
      }),
    }),

    findOne: builder.query<IUser, number>({
      query: payload => ({
        url: ROUTES.api.user(payload),
        method: 'GET',
        credentials: 'include',
      }),
    }),

    update: builder.mutation<boolean, IUpdateReq<IUser>>({
      query: payload => ({
        url: ROUTES.api.user(payload.id),
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      }),
      invalidatesTags: ['Entities'],
    }),

    updateRoles: builder.mutation<boolean, IUpdateReq<IUsersRoles[]>>({
      query: payload => ({
        url: ROUTES.api.userRoles(payload.id),
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      }),
      invalidatesTags: ['Entities'],
    }),

    delete: builder.mutation<boolean, number | number[]>({
      query: payload => ({
        url: ROUTES.api.users,
        method: 'DELETE',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Entities'],
    }),

  }),
});
export default usersApi;
