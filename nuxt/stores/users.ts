import { defineStore } from 'pinia'

import type { IListReq, IUser } from '~/libs/types'

export const useUsersStore = defineStore('users', () => {
  const {
    data: users,
    error: getUsersError,
    pending: getUsersLoading,
    execute: getUsers,
  } = useCustomFetch<IUser[], IListReq<IUser> | void>('users', { method: 'get', credentials: 'include' })

  return {
    users,
    getUsersError,
    getUsersLoading,
    getUsers,
  }
})
