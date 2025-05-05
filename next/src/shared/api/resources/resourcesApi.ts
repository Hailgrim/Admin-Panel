import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReauth from '../baseQueryWithReauth';
import resourcesService from '@/shared/api/resources/resourcesService';
import {
  IResource,
  TCreateResource,
  TGetResources,
  TUpdateResource,
} from './types';
import {
  IGetListResponse,
  TGetListRequest,
  IUpdateReq,
  IQueryItems,
} from '../types';

const resourcesApi = createApi({
  reducerPath: 'resources',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IResource, TCreateResource>({
      query: resourcesService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    findAll: builder.query<
      IGetListResponse<IResource>,
      TGetListRequest<TGetResources> | void
    >({
      query: resourcesService.findAllArgs,
      providesTags: ['Entities'],
    }),

    findOne: builder.query<IResource, IResource['id']>({
      query: resourcesService.findOneArgs,
      providesTags: ['Entity'],
    }),

    update: builder.mutation<
      boolean,
      IUpdateReq<TUpdateResource, IResource['id']>
    >({
      query: resourcesService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<boolean, IQueryItems<IResource['id']>>({
      query: resourcesService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default resourcesApi;
