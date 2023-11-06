import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import {
  IFindAndCountRes,
  IListReq,
  IUpdateReq,
  IRole,
  IRoleCreate,
  IRolesResources,
} from '../../lib/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import { ROUTES } from '../../lib/constants';

const rolesApi = createApi({
  reducerPath: 'roles',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Entities'],
  endpoints: builder => ({

    create: builder.mutation<IRole, IRoleCreate>({
      query: payload => ({
        url: ROUTES.api.roles,
        method: 'POST',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Entities'],
    }),

    findAll: builder.query<IRole[], IListReq<IRole> | void>({
      query: payload => ({
        url: ROUTES.api.roles,
        method: 'GET',
        credentials: 'include',
        params: payload || undefined,
      }),
      providesTags: ['Entities'],
    }),

    findAndCountAll: builder.query<IFindAndCountRes<IRole>, IListReq<IRole> | void>({
      query: payload => ({
        url: ROUTES.api.roles,
        method: 'GET',
        credentials: 'include',
        params: { ...payload, count: true },
      }),
    }),

    findOne: builder.query<IRole, number>({
      query: payload => ({
        url: ROUTES.api.role(payload),
        method: 'GET',
        credentials: 'include',
      }),
    }),

    update: builder.mutation<boolean, IUpdateReq<IRole>>({
      query: payload => ({
        url: ROUTES.api.role(payload.id),
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      }),
      invalidatesTags: ['Entities'],
    }),

    updateResources: builder.mutation<boolean, IUpdateReq<IRolesResources[]>>({
      query: payload => ({
        url: ROUTES.api.roleResources(payload.id),
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      }),
      invalidatesTags: ['Entities'],
    }),

    delete: builder.mutation<boolean, number | number[]>({
      query: payload => ({
        url: ROUTES.api.roles,
        method: 'DELETE',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Entities'],
    }),

  }),
});
export default rolesApi;
