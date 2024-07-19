import { defineStore } from 'pinia';

import type { IFindAndCountRes, IListReq, IUpdateReq } from '../types';
import type { IResource, IResourceCreate } from './types';

export const useResourcesStore = defineStore('resources', () => {
  const {
    pending: createPending,
    error: createError,
    data: createData,
    execute: create,
  } = useCustomFetch<IResource, IResourceCreate>((payload) => ({
    url: ROUTES.api.resources,
    options: { method: 'POST', credentials: 'include', body: payload },
  }));

  const {
    pending: listPending,
    error: listError,
    data: listData,
    execute: list,
    refresh: listRefresh,
  } = useCustomFetch<IResource[], IListReq<IResource> | undefined>(
    (payload) => ({
      url: ROUTES.api.resources,
      options: { method: 'GET', credentials: 'include', params: payload },
    })
  );

  const {
    pending: listCountedPending,
    error: listCountedError,
    data: listCountedData,
    execute: listCounted,
    refresh: listCountedRefresh,
  } = useCustomFetch<
    IFindAndCountRes<IResource>,
    IListReq<IResource> | undefined
  >((payload) => ({
    url: ROUTES.api.resources,
    options: {
      method: 'GET',
      credentials: 'include',
      params: { ...payload, count: true },
    },
  }));

  const {
    pending: readPending,
    error: readError,
    data: readData,
    execute: read,
    refresh: readRefresh,
  } = useCustomFetch<IResource, IResource['id']>((payload) => ({
    url: ROUTES.api.resource(payload),
    options: { method: 'GET', credentials: 'include' },
  }));

  const {
    pending: updatePending,
    error: updateError,
    data: updateData,
    execute: update,
  } = useCustomFetch<boolean, IUpdateReq<IResource>>((payload) => ({
    url: ROUTES.api.resource(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }));

  const {
    pending: deletePending,
    error: deleteError,
    data: deleteData,
    execute,
  } = useCustomFetch<boolean, IResource['id'] | IResource['id'][]>(
    (payload) => ({
      url: ROUTES.api.resources,
      options: { method: 'DELETE', credentials: 'include', body: payload },
    })
  );

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
    deletePending,
    deleteError,
    deleteData,
    delete: execute,
  };
});
