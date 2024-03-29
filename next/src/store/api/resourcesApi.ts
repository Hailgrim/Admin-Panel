import { createApi } from '@reduxjs/toolkit/query/react';

import {
  IFindAndCountRes,
  IListReq,
  IUpdateReq,
  IResource,
  IResourceCreate,
} from '@/lib/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import resourcesService from '@/services/resourcesService';

const resourcesApi = createApi({
  reducerPath: 'resources',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IResource, IResourceCreate>({
      query: resourcesService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    findAll: builder.query<IResource[], IListReq<IResource> | void>({
      query: resourcesService.findAllArgs,
      providesTags: ['Entities'],
    }),

    findAndCountAll: builder.query<
      IFindAndCountRes<IResource>,
      IListReq<IResource> | void
    >({
      query: resourcesService.findAndCountAllArgs,
      providesTags: ['CountedEntities'],
    }),

    findOne: builder.query<IResource, number>({
      query: resourcesService.findOneArgs,
      providesTags: ['Entity'],
    }),

    update: builder.mutation<boolean, IUpdateReq<IResource>>({
      query: resourcesService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<boolean, number | number[]>({
      query: resourcesService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default resourcesApi;
