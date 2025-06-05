class AuthApi {
  signUp = (payload: TFetchPayload<TSignUp>) =>
    useAPI<IUser>(ROUTES.api.sighUp, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  forgotPassword = (payload: TFetchPayload<IForgotPassword>) =>
    useAPI(ROUTES.api.forgotPassword, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  resetPassword = (payload: TFetchPayload<IResetPassword>) =>
    useAPI(ROUTES.api.resetPassword, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  verifyUser = (payload: TFetchPayload<IVerifyUser>) =>
    useAPI(ROUTES.api.verifyUser, {
      immediate: false,
      watch: false,
      method: 'POST',
      body: payload,
    })

  signIn = (payload: TFetchPayload<ISignIn>) =>
    useAPI<IUser>(ROUTES.api.signIn, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  signInGoogle = (payload: TFetchPayload<ISignInGoogle>) =>
    useAPI<IUser>(ROUTES.api.signInGoogle, {
      immediate: false,
      watch: false,
      method: 'POST',
      credentials: 'include',
      body: payload,
    })

  signOut = () =>
    useAPI(ROUTES.api.signOut, {
      immediate: false,
      watch: false,
      method: 'DELETE',
      credentials: 'include',
    })
}

const authApi = new AuthApi()
export default authApi
