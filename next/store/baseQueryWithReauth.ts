import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { API_HOST } from '../libs/config';
import { RootState } from './store';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_HOST}/`,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken, refreshToken, rememberMe } = (getState() as RootState).app;
    if (accessToken || refreshToken) {
      headers.set(
        'Cookie',
        `accessToken=${accessToken};refreshToken=${refreshToken}${rememberMe ? ';rememberMe' : ''}`,
      );
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
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
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
