import { ROUTES } from '@/shared/lib/constants';
import { IResetPassword, IUserSignIn, IUserSignUp, IVerifyUser } from './types';
import { IReqArgs } from '../types';

class AuthService {
  signUpArgs(payload: IUserSignUp): IReqArgs {
    return {
      url: ROUTES.api.sighUp,
      method: 'POST',
      body: payload,
    };
  }

  forgotPasswordArgs(payload: string): IReqArgs {
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

  signInArgs(payload: IUserSignIn): IReqArgs {
    return {
      url: ROUTES.api.signIn,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  signInGoogleArgs(payload: string): IReqArgs {
    return {
      url: ROUTES.api.signInGoogle,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  verifyUserArgs(payload: IVerifyUser): IReqArgs {
    return {
      url: ROUTES.api.verify,
      method: 'POST',
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
