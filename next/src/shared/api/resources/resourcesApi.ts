import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReauth from '../baseQueryWithReauth';
import resourcesService from '@/shared/api/resources/resourcesService';
import {
  IGetListResponse,
  IQueryItems,
  IResource,
  IUpdateReq,
  TCreateResource,
  TGetListRequest,
  TGetResources,
  TUpdateResource,
} from '@ap/shared';

const resourcesApi = createApi({
  reducerPath: 'resources',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IResource, TCreateResource>({
      query: resourcesService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    getOne: builder.query<IResource, IResource['id']>({
      query: resourcesService.getOneArgs,
      providesTags: ['Entity'],
    }),

    getList: builder.query<
      IGetListResponse<IResource>,
      TGetListRequest<TGetResources> | void
    >({
      query: resourcesService.getListArgs,
      providesTags: ['Entities'],
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
