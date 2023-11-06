import { defineStore } from 'pinia'

import type { IResetPassword, IUser, IUserSignIn, IUserSignUp, IVerifyUser } from '~/utils/types'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<IUser | null>(null)

  const {
    pending: signUpPending,
    error: signUpError,
    data: signUpData,
    execute: signUp,
  } = useCustomFetch<IUser, IUserSignUp>(payload => ({
    url: ROUTES.api.auth.sighUp,
    options: { method: 'POST', body: payload },
  }))

  const {
    pending: forgotPasswordPending,
    error: forgotPasswordError,
    data: forgotPasswordData,
    refresh: forgotPassword,
  } = useCustomFetch<boolean, string>(payload => ({
    url: ROUTES.api.auth.forgotPassword,
    options: { method: 'POST', body: payload },
  }))

  const {
    pending: resetPasswordPending,
    error: resetPasswordError,
    data: resetPasswordData,
    execute: resetPassword,
  } = useCustomFetch<boolean, IResetPassword>(payload => ({
    url: ROUTES.api.auth.resetPassword,
    options: { method: 'POST', body: payload },
  }))

  const {
    pending: signInPending,
    error: signInError,
    data: signInData,
    execute: signInExecute,
  } = useCustomFetch<IUser, IUserSignIn>(payload => ({
    url: ROUTES.api.auth.signIn,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))
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
  } = useCustomFetch<boolean, IVerifyUser>(payload => ({
    url: ROUTES.api.auth.verify,
    options: { method: 'POST', body: payload },
  }))

  const {
    pending: getProfilePending,
    error: getProfileError,
    data: getProfileData,
    execute: getProfileExecute,
  } = useCustomFetch<IUser, void>(() => ({
    url: ROUTES.api.auth.getProfile,
    options: { method: 'GET', credentials: 'include' },
  }))
  async function getProfile() {
    await getProfileExecute()
    if (getProfileData.value)
      profile.value = getProfileData.value
    return profile.value
  }

  const {
    pending: updateProfilePending,
    error: updateProfileError,
    data: updateProfileData,
    execute: updateProfileExecute,
  } = useCustomFetch<boolean, Partial<IUser>>(payload => ({
    url: ROUTES.api.auth.updateProfile,
    options: { method: 'PATCH', credentials: 'include', body: payload },
  }))
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
  } = useCustomFetch<boolean, void>(() => ({
    url: ROUTES.api.auth.signOut,
    options: { method: 'DELETE', credentials: 'include' },
  }))
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
