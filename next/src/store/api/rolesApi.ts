import { createApi } from '@reduxjs/toolkit/query/react';

import {
  IFindAndCountRes,
  IListReq,
  IUpdateReq,
  IRole,
  IRoleCreate,
  IRolesResources,
} from '@/lib/types';
import baseQueryWithReauth from '../baseQueryWithReauth';
import rolesService from '@/services/rolesService';

const rolesApi = createApi({
  reducerPath: 'roles',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['CountedEntities', 'Entities', 'Entity'],
  endpoints: (builder) => ({
    create: builder.mutation<IRole, IRoleCreate>({
      query: rolesService.createArgs,
      invalidatesTags: ['CountedEntities'],
    }),

    findAll: builder.query<IRole[], IListReq<IRole> | void>({
      query: rolesService.findAllArgs,
      providesTags: ['Entities'],
    }),

    findAndCountAll: builder.query<
      IFindAndCountRes<IRole>,
      IListReq<IRole> | void
    >({
      query: rolesService.findAndCountAllArgs,
      providesTags: ['CountedEntities'],
    }),

    findOne: builder.query<IRole, number>({
      query: rolesService.findOneArgs,
      providesTags: ['Entity'],
    }),

    update: builder.mutation<boolean, IUpdateReq<IRole>>({
      query: rolesService.updateArgs,
      invalidatesTags: ['Entity'],
    }),

    updateResources: builder.mutation<boolean, IUpdateReq<IRolesResources[]>>({
      query: rolesService.updateResourcesArgs,
      invalidatesTags: ['Entity'],
    }),

    delete: builder.mutation<boolean, number | number[]>({
      query: rolesService.deleteArgs,
      invalidatesTags: ['CountedEntities'],
    }),
  }),
});
export default rolesApi;
