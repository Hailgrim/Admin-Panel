import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { API_HOST, PROJECT_TAG } from '../libs/config';
import { RootState } from './store';
import { ROUTES } from '../libs/constants';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_HOST,
  prepareHeaders: (headers, { getState }) => {
    const {
      accessToken,
      refreshToken,
      rememberMe,
      userAgent,
    } = (getState() as RootState).app;

    if (refreshToken) {
      headers.set(
        'Cookie',
        `${PROJECT_TAG}_refreshToken=${refreshToken}`
          .concat(accessToken ? `;${PROJECT_TAG}_accessToken=${accessToken}` : '')
          .concat(rememberMe ? `;${PROJECT_TAG}_rememberMe=true` : ''),
      );
    }

    if (userAgent) {
      headers.set('User-Agent', userAgent);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(ROUTES.api.auth.refresh, api, extraOptions);
        if (refreshResult.data) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // ...
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
export default baseQueryWithReauth;
