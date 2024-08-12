import { ROUTES } from '@/shared/lib/constants';
import { IFetchRes, IReqArgs } from '../types';
import { IUser } from '../users/types';
import serverFetch from '../serverFetch';
import { IUpdatePassword } from './types';

class ProfileService {
  getProfileArgs(): IReqArgs {
    return {
      url: ROUTES.api.profile,
      method: 'GET',
      credentials: 'include',
    };
  }

  async getProfile(): Promise<IFetchRes<IUser | null>> {
    const { data, error, newCookies } = await serverFetch<IUser>(
      this.getProfileArgs()
    );
    return { data, error, newCookies };
  }

  updateProfileArgs(payload: Partial<IUser>): IReqArgs {
    return {
      url: ROUTES.api.profile,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    };
  }

  updatePasswordArgs(payload: IUpdatePassword): IReqArgs {
    return {
      url: ROUTES.api.updatePassword,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    };
  }

  changeEmailRequestArgs(payload: string): IReqArgs {
    return {
      url: ROUTES.api.changeEmail,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  changeEmailConfirmArgs(payload: string): IReqArgs {
    return {
      url: ROUTES.api.changeEmail,
      method: 'PATCH',
      credentials: 'include',
      body: payload,
    };
  }

  getSessionsArgs(): IReqArgs {
    return {
      url: ROUTES.api.sessions,
      method: 'GET',
      credentials: 'include',
    };
  }

  deleteSessionsArgs(payload: string[]): IReqArgs {
    return {
      url: ROUTES.api.sessions,
      method: 'DELETE',
      credentials: 'include',
      body: payload,
    };
  }
}

const profileService = new ProfileService();
export default profileService;
