import { createApi } from '@reduxjs/toolkit/query/react';

import rolesService from '@/shared/api/roles/rolesService';
import baseQueryWithReauth from '../baseQueryWithReauth';
import { IRole, TCreateRole, TGetRoles, TUpdateRole } from './types';
import {
  IGetListResponse,
  TGetListRequest,
  IUpdateReq,
  IQueryItems,
  IRights,
} from '../types';

const rolesApi = createApi({
  reducerPath: 'roles',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IRole, TCreateRole>({
      query: rolesService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    findAll: builder.query<
      IGetListResponse<IRole>,
      TGetListRequest<TGetRoles> | void
    >({
      query: rolesService.findAllArgs,
      providesTags: ['Entities'],
    }),

    findOne: builder.query<IRole, IRole['id']>({
      query: rolesService.findOneArgs,
      providesTags: ['Entity'],
    }),

    update: builder.mutation<boolean, IUpdateReq<TUpdateRole, IRole['id']>>({
      query: rolesService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    updateResources: builder.mutation<
      boolean,
      IUpdateReq<IRights[], IRole['id']>
    >({
      query: rolesService.updateResourcesArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<boolean, IQueryItems<IRole['id']>>({
      query: rolesService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default rolesApi;
