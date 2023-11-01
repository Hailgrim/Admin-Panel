import { defineStore } from 'pinia'

import type { IFindAndCountRes, IListReq, IUpdateReq, IUser, IUserCreate, IUsersRoles } from '~/utils/types'

export const useUsersStore = defineStore('users', () => {
  const {
    pending: createPending,
    error: createError,
    data: createData,
    execute: create,
  } = useCustomFetch<IUser, IUserCreate>(payload => ({
    url: ROUTES.api.users,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  const {
    pending: listPending,
    error: listError,
    data: listData,
    execute: list,
    refresh: listRefresh,
  } = useCustomFetch<IUser[], IListReq<IUser> | void>(payload => ({
    url: ROUTES.api.users,
    options: { method: 'GET', credentials: 'include', params: payload },
  }))

  const {
    pending: listCountedPending,
    error: listCountedError,
    data: listCountedData,
    execute: listCounted,
    refresh: listCountedRefresh,
  } = useCustomFetch<IFindAndCountRes<IUser>, IListReq<IUser> | void>(payload => ({
    url: ROUTES.api.users,
    options: { method: 'GET', credentials: 'include', params: { ...payload, count: true } },
  }))

  const {
    pending: readPending,
    error: readError,
    data: readData,
    execute: read,
    refresh: readRefresh,
  } = useCustomFetch<IUser, number>(payload => ({
    url: ROUTES.api.user(payload),
    options: { method: 'GET', credentials: 'include' },
  }))

  const {
    pending: updatePending,
    error: updateError,
    data: updateData,
    execute: update,
  } = useCustomFetch<boolean, IUpdateReq<IUser>>(payload => ({
    url: ROUTES.api.user(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  const {
    pending: updateRolesPending,
    error: updateRolesError,
    data: updateRolesData,
    execute: updateRoles,
  } = useCustomFetch<boolean, IUpdateReq<IUsersRoles[]>>(payload => ({
    url: ROUTES.api.userRoles(payload.id),
    options: { method: 'PATCH', credentials: 'include', body: payload.fields },
  }))

  const {
    pending: deletePending,
    error: deleteError,
    data: deleteData,
    execute,
  } = useCustomFetch<boolean, number | number[]>(payload => ({
    url: ROUTES.api.users,
    options: { method: 'DELETE', credentials: 'include', body: payload },
  }))

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
    updateRolesPending,
    updateRolesError,
    updateRolesData,
    updateRoles,
    deletePending,
    deleteError,
    deleteData,
    delete: execute,
  }
})
