import { ROUTES } from '@/shared/lib/constants';
import { IResetPassword, IUserSignIn, IUserSignUp, IVerifyUser } from './types';
import { IFetchRes, IReqArgs } from '../types';
import { IUser } from '../users/types';
import serverFetch from '../serverFetch';

class AuthService {
  signUpArgs(payload: IUserSignUp): IReqArgs {
    return {
      url: ROUTES.api.auth.sighUp,
      method: 'POST',
      body: payload,
    };
  }

  signInArgs(payload: IUserSignIn): IReqArgs {
    return {
      url: ROUTES.api.auth.signIn,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  verifyUserArgs(payload: IVerifyUser): IReqArgs {
    return {
      url: ROUTES.api.auth.verify,
      method: 'POST',
      body: payload,
    };
  }

  forgotPasswordArgs(payload: string): IReqArgs {
    return {
      url: ROUTES.api.auth.forgotPassword,
      method: 'POST',
      body: payload,
    };
  }

  resetPasswordArgs(payload: IResetPassword): IReqArgs {
    return {
      url: ROUTES.api.auth.resetPassword,
      method: 'POST',
      body: payload,
    };
  }

  refreshArgs(): IReqArgs {
    return {
      url: ROUTES.api.auth.refresh,
      method: 'GET',
      credentials: 'include',
    };
  }

  getProfileArgs(): IReqArgs {
    return {
      url: ROUTES.api.auth.profile,
      method: 'GET',
      credentials: 'include',
    };
  }

  async getProfile(): Promise<IFetchRes<IUser | null>> {
    const { data, error, newCookies } = await serverFetch<IUser>(
      this.getProfileArgs(),
      true
    );
    return { data, error, newCookies };
  }

  updateProfileArgs(payload: Partial<IUser>): IReqArgs {
    return {
      url: ROUTES.api.auth.profile,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    };
  }

  signOutArgs(): IReqArgs {
    return {
      url: ROUTES.api.auth.signOut,
      method: 'DELETE',
      credentials: 'include',
    };
  }
}

const authService = new AuthService();
export default authService;
