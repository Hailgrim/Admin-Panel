import { defineStore } from 'pinia';

import type { IFindAndCountRes, IListReq, IUpdateReq } from '../types';
import type { IRole, IRoleCreate } from './types';
import type { IRolesResources } from '../resources/types';

export const useRolesStore = defineStore('roles', () => {
  const {
    pending: createPending,
    error: createError,
    data: createData,
    execute: create,
  } = useCustomFetch<IRole, IRoleCreate>((payload) => ({
    url: ROUTES.api.roles,
    options: { method: 'POST', credentials: 'include', body: payload },
  }));

  const {
    pending: listPending,
    error: listError,
    data: listData,
    execute: list,
    refresh: listRefresh,
  } = useCustomFetch<IRole[], IListReq<IRole> | undefined>((payload) => ({
    url: ROUTES.api.roles,
    options: { method: 'GET', credentials: 'include', params: payload },
  }));

  const {
    pending: listCountedPending,
    error: listCountedError,
    data: listCountedData,
    execute: listCounted,
    refresh: listCountedRefresh,
  } = useCustomFetch<IFindAndCountRes<IRole>, IListReq<IRole> | undefined>(
    (payload) => ({
      url: ROUTES.api.roles,
      options: {
        method: 'GET',
        credentials: 'include',
        params: { ...payload, count: true },
      },
    })
  );

  const {
    pending: readPending,
    error: readError,
    data: readData,
    execute: read,
    refresh: readRefresh,
  } = useCustomFetch<IRole, IRole['id']>((payload) => ({
    url: ROUTES.api.role(payload),
    options: { method: 'GET', credentials: 'include' },
  }));

  const {
    pending: updatePending,
    error: updateError,
    data: updateData,
    execute: update,
  } = useCustomFetch<boolean, IUpdateReq<IRole>>((payload) => ({
    url: ROUTES.api.role(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }));

  const {
    pending: updateResourcesPending,
    error: updateResourcesError,
    data: updateResourcesData,
    execute: updateResources,
  } = useCustomFetch<boolean, IUpdateReq<IRolesResources[], IRole['id']>>(
    (payload) => ({
      url: ROUTES.api.roleResources(payload.id),
      options: {
        method: 'PATCH',
        credentials: 'include',
        body: payload.fields,
      },
    })
  );

  const {
    pending: deletePending,
    error: deleteError,
    data: deleteData,
    execute,
  } = useCustomFetch<boolean, IRole['id'] | IRole['id'][]>((payload) => ({
    url: ROUTES.api.roles,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }));

  return {
    createPending,
    createError,
    createData,
    create,
    listPending,
    listError,
    listData,
    list,
    listRefresh,
    listCountedPending,
    listCountedError,
    listCountedData,
    listCounted,
    listCountedRefresh,
    readPending,
    readError,
    readData,
    read,
    readRefresh,
    updatePending,
    updateError,
    updateData,
    update,
    updateResourcesPending,
    updateResourcesError,
    updateResourcesData,
    updateResources,
    deletePending,
    deleteError,
    deleteData,
    delete: execute,
  };
});
