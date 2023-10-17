import { defineStore } from 'pinia'

import type { IUser, IUserSignIn, IUserSignUp, IVerifyUser } from '~/libs/types'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IUser | null>(null)
  function setProfile(value: IUser | null) {
    profile.value = value
  }

  const {
    data: signUpResult,
    error: signUpError,
    pending: signUpLoading,
    execute: signUp,
  } = useCustomFetch<IUser, IUserSignUp>('/auth/sign-up', { method: 'post' })

  const {
    data,
    error: signInError,
    pending: signInLoading,
    execute,
  } = useCustomFetch<IUser, IUserSignIn>('/auth/sign-in', { method: 'post', credentials: 'include' })
  async function signIn(payload: IUserSignIn) {
    await execute(payload)
    if (data.value)
      profile.value = data.value
  }

  const {
    data: verifyResult,
    error: verifyError,
    pending: verifyLoading,
    execute: verify,
  } = useCustomFetch<boolean, IVerifyUser>('/auth/verify-user', { method: 'post' })

  return {
    profile,
    setProfile,
    signUpLoading,
    signUpError,
    signUpResult,
    signUp,
    signInLoading,
    signInError,
    signIn,
    verifyLoading,
    verifyError,
    verifyResult,
    verify,
  }
})
