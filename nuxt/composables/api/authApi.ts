class AuthApi {
  signUp = useAPI<IUser, TSignUp>(payload => ({
    url: ROUTES.api.sighUp,
    options: { method: 'POST', body: payload },
  }))

  forgotPassword = useAPI<undefined, IForgotPassword>(payload => ({
    url: ROUTES.api.forgotPassword,
    options: { method: 'POST', body: payload },
  }))

  resetPassword = useAPI<undefined, IResetPassword>(payload => ({
    url: ROUTES.api.resetPassword,
    options: { method: 'POST', body: payload },
  }))

  verifyUser = useAPI<undefined, IVerifyUser>(payload => ({
    url: ROUTES.api.verifyUser,
    options: { method: 'POST', body: payload },
  }))

  signIn = useAPI<IUser, ISignIn>(payload => ({
    url: ROUTES.api.signIn,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  signInGoogle = useAPI<IUser, ISignInGoogle>(payload => ({
    url: ROUTES.api.signInGoogle,
    options: { method: 'POST', credentials: 'include', body: payload },
  }))

  signOut = useAPI<undefined>(() => ({
    url: ROUTES.api.signOut,
    options: { method: 'DELETE', credentials: 'include' },
  }))
}

const authApi = new AuthApi()
export default authApi
