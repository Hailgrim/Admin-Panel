import { createApi } from '@reduxjs/toolkit/query/react';

import rolesService from '@/shared/api/roles/rolesService';
import baseQueryWithReauth from '../baseQueryWithReauth';
import {
  IGetListResponse,
  IQueryItems,
  IRights,
  IRole,
  IUpdateReq,
  TCreateRole,
  TGetListRequest,
  TGetRoles,
  TUpdateRole,
} from '@ap/shared/src/types';

const rolesApi = createApi({
  reducerPath: 'roles',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IRole, TCreateRole>({
      query: rolesService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    getOne: builder.query<IRole, IRole['id']>({
      query: rolesService.getOneArgs,
      providesTags: ['Entity'],
    }),

    getList: builder.query<
      IGetListResponse<IRole>,
      TGetListRequest<TGetRoles> | void
    >({
      query: rolesService.getListArgs,
      providesTags: ['Entities'],
    }),

    update: builder.mutation<undefined, IUpdateReq<TUpdateRole, IRole['id']>>({
      query: rolesService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    updateRights: builder.mutation<
      undefined,
      IUpdateReq<IQueryItems<IRights>, IRole['id']>
    >({
      query: rolesService.updateRightsArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<undefined, IQueryItems<IRole['id']>>({
      query: rolesService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default rolesApi;
