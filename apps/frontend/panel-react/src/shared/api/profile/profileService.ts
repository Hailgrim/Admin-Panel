import { IFetchRes, IReqArgs } from '../types';
import serverFetch from '../serverFetch';
import { ROUTES } from '@ap/shared/src/libs';
import {
  IChangeEmailConfirm,
  IChangeEmailRequest,
  IQueryItems,
  IUpdatePassword,
  IUser,
  TExternalSession,
  TUpdateUser,
} from '@ap/shared/src/types';

class ProfileService {
  getProfileArgs(): IReqArgs {
    return {
      url: ROUTES.api.profile,
      method: 'GET',
      credentials: 'include',
    };
  }

  async getProfile(): Promise<IFetchRes<IUser>> {
    return serverFetch<IUser>(this.getProfileArgs());
  }

  updateProfileArgs(payload: TUpdateUser): IReqArgs {
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

  changeEmailRequestArgs(payload: IChangeEmailRequest): IReqArgs {
    return {
      url: ROUTES.api.changeEmail,
      method: 'POST',
      credentials: 'include',
      body: payload,
    };
  }

  changeEmailConfirmArgs(payload: IChangeEmailConfirm): IReqArgs {
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

  deleteSessionsArgs(payload: IQueryItems<TExternalSession['id']>): IReqArgs {
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
