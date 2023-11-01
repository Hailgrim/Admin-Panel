import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import {
  IFindAndCountRes,
  IListReq,
  IUpdateReq,
  IResource,
  IResourceCreate,
} from '../../libs/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import { ROUTES } from '../../libs/constants';

const resourcesApi = createApi({
  reducerPath: 'resources',
  baseQuery: baseQueryWithReauth,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Entities'],
  endpoints: builder => ({

    create: builder.mutation<IResource, IResourceCreate>({
      query: payload => ({
        url: ROUTES.api.resources,
        method: 'POST',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Entities'],
    }),

    findAll: builder.query<IResource[], IListReq<IResource> | void>({
      query: payload => ({
        url: ROUTES.api.resources,
        method: 'GET',
        credentials: 'include',
        params: payload || undefined,
      }),
      providesTags: ['Entities'],
    }),

    findAndCountAll: builder.query<IFindAndCountRes<IResource>, IListReq<IResource> | void>({
      query: payload => ({
        url: ROUTES.api.resources,
        method: 'GET',
        credentials: 'include',
        params: { ...payload, count: true },
      }),
    }),

    findOne: builder.query<IResource, number>({
      query: payload => ({
        url: ROUTES.api.resource(payload),
        method: 'GET',
        credentials: 'include',
      }),
    }),

    update: builder.mutation<boolean, IUpdateReq<IResource>>({
      query: payload => ({
        url: ROUTES.api.resource(payload.id),
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      }),
      invalidatesTags: ['Entities'],
    }),

    delete: builder.mutation<boolean, number | number[]>({
      query: payload => ({
        url: ROUTES.api.resources,
        method: 'DELETE',
        credentials: 'include',
        body: payload,
      }),
      invalidatesTags: ['Entities'],
    }),

  }),
});
export default resourcesApi;
