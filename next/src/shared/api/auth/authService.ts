import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  ISignInGoogle,
  IVerifyUser,
  ROUTES,
  TSignUp,
} from '@ap/shared';
import { IReqArgs } from '../types';

class AuthService {
  signUpArgs(payload: TSignUp): IReqArgs {
    return {
      url: ROUTES.api.sighUp,
      method: 'POST',
      body: payload,
    };
  }

  forgotPasswordArgs(payload: IForgotPassword): IReqArgs {
    return {
      url: ROUTES.api.forgotPassword,
      method: 'POST',
      body: payload,
    };
  }

  resetPasswordArgs(payload: IResetPassword): IReqArgs {
    return {
      url: ROUTES.api.resetPassword,
      method: 'POST',
      body: payload,
    };
  }

  signInArgs(payload: ISignIn): IReqArgs {
    return {
      url: ROUTES.api.signIn,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  verifyUserArgs(payload: IVerifyUser): IReqArgs {
    return {
      url: ROUTES.api.verifyUser,
      method: 'POST',
      body: payload,
    };
  }

  signInGoogleArgs(payload: ISignInGoogle): IReqArgs {
    return {
      url: ROUTES.api.signInGoogle,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  refreshArgs(): IReqArgs {
    return {
      url: ROUTES.api.refresh,
      method: 'GET',
      credentials: 'include',
    };
  }

  signOutArgs(): IReqArgs {
    return {
      url: ROUTES.api.signOut,
      method: 'DELETE',
      credentials: 'include',
    };
  }
}

const authService = new AuthService();
export default authService;
