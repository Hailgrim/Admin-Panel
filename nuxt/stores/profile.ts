import { defineStore } from 'pinia'

import type { ICookies, IResetPassword, IUpdateReq, IUser, IUserSignIn, IUserSignUp, IVerifyUser } from '~/libs/types'
import { ROUTES } from '~/libs/constants'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IUser | null>(null)

  const {
    pending: signUpPending,
    error: signUpError,
    data: signUpData,
    execute: signUp,
  } = useCustomFetch<IUser, IUserSignUp>(ROUTES.api.auth.sighUp, { method: 'POST' })

  const {
    pending: forgotPasswordPending,
    error: forgotPasswordError,
    data: forgotPasswordData,
    refresh: forgotPassword,
  } = useCustomFetch<boolean, string>(ROUTES.api.auth.forgotPassword, { method: 'POST' })

  const {
    pending: resetPasswordPending,
    error: resetPasswordError,
    data: resetPasswordData,
    execute: resetPassword,
  } = useCustomFetch<boolean, IResetPassword>(ROUTES.api.auth.resetPassword, { method: 'POST' })

  const {
    pending: signInPending,
    error: signInError,
    data: signInData,
    execute: signInExecute,
  } = useCustomFetch<IUser, IUserSignIn>(ROUTES.api.auth.signIn, { method: 'POST', credentials: 'include' })
  async function signIn(payload: IUserSignIn) {
    await signInExecute(payload)
    if (signInData.value)
      profile.value = signInData.value
  }

  const {
    pending: verifyPending,
    error: verifyError,
    data: verifyData,
    execute: verify,
  } = useCustomFetch<boolean, IVerifyUser>(ROUTES.api.auth.verify, { method: 'POST' })

  const {
    pending: refreshPending,
    error: refreshError,
    data: refreshData,
    execute: refresh,
  } = useCustomFetch<ICookies, void>(ROUTES.api.auth.refresh, { method: 'GET', credentials: 'include' })

  const {
    pending: getProfilePending,
    error: getProfileError,
    data: getProfileData,
    execute: getProfileExecute,
  } = useCustomFetch<IUser, void>(ROUTES.api.auth.getProfile, { method: 'GET', credentials: 'include' })
  async function getProfile() {
    await getProfileExecute()
    if (getProfileData.value)
      profile.value = getProfileData.value
  }

  const {
    pending: updateProfilePending,
    error: updateProfileError,
    data: updateProfileData,
    execute: updateProfileExecute,
  } = useCustomFetch<boolean, Partial<IUser>>(ROUTES.api.auth.updateProfile, { method: 'PATCH', credentials: 'include' })
  async function updateProfile(arg: Partial<IUser>) {
    await updateProfileExecute(arg)
    if (updateProfileData.value && profile.value)
      profile.value = { ...profile.value, ...arg }
  }

  const {
    pending: signOutPending,
    error: signOutError,
    data: signOutData,
    execute: signOutExecute,
  } = useCustomFetch<boolean, void>(ROUTES.api.auth.signOut, { method: 'DELETE', credentials: 'include' })
  async function signOut() {
    await signOutExecute()
    if (signOutData.value)
      profile.value = null
  }

  return {
    profile,
    signUpPending,
    signUpError,
    signUpData,
    signUp,
    forgotPasswordData,
    forgotPasswordError,
    forgotPasswordPending,
    forgotPassword,
    resetPasswordPending,
    resetPasswordError,
    resetPasswordData,
    resetPassword,
    signInPending,
    signInError,
    signIn,
    verifyPending,
    verifyError,
    verifyData,
    verify,
    refreshPending,
    refreshError,
    refreshData,
    refresh,
    getProfilePending,
    getProfileError,
    getProfile,
    updateProfilePending,
    updateProfileError,
    updateProfileData,
    updateProfile,
    signOutPending,
    signOutError,
    signOutData,
    signOut,
  }
})
