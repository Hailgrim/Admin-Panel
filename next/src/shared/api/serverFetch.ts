'use server';

import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';

import { API_HOST } from '@/shared/lib/config';
import authService from '@/shared/api/auth/authService';
import { IFetchRes, IReqArgs } from './types';

const parseRawCookies = (cookies: string) => {
  const tempCookie = cookies.split('; ').map((value) => value.split('='));
  const result: ResponseCookie = {
    name: tempCookie[0][0],
    value: tempCookie[0][1],
  };
  const options = Object.fromEntries(tempCookie.slice(1));
  if (options['Max-Age'] !== undefined) result.maxAge = options['Max-Age'];
  if (options['Domain'] !== undefined) result.domain = options['Domain'];
  if (options['Path'] !== undefined) result.path = options['Path'];
  if ('HttpOnly' in options) result.httpOnly = true;
  if ('Secure' in options) result.secure = true;
  if (options['SameSite'] !== undefined) result.sameSite = options['SameSite'];
  return result;
};

const serverFetch = async <T = unknown>(
  options: IReqArgs,
  setCookies?: boolean
): Promise<IFetchRes<T>> => {
  const headersList = headers();
  const cookieStore = cookies();
  let data: T | null = null;
  let error: number | null = null;
  let newCookies: ResponseCookie[] | null = null;
  let newCookiesRaw: string | null = headersList.get('set-cookie');

  const query = async <U>(payload: IReqArgs): Promise<U | null> => {
    try {
      const res = await fetch(
        `${API_HOST}${payload.url}${
          payload.params ? `?${new URLSearchParams(payload.params)}` : ''
        }`,
        {
          ...payload,
          headers: {
            Cookie: `${cookieStore.toString()}${
              newCookiesRaw ? `; ${newCookiesRaw}` : ''
            }`,
          },
        }
      );

      if (res.status >= 400) {
        error = res.status;
        return null;
      } else if (res.status >= 200) {
        error = null;
      }

      const rawCookies = res.headers.getSetCookie();
      if (rawCookies.length) {
        newCookiesRaw = rawCookies[0];
        newCookies = rawCookies[0].split(', ').map(parseRawCookies);

        if (setCookies) {
          // Doesn't work
          // for (const cookie of newCookies) {
          //   cookieStore.set(cookie);
          // }
        }
      }

      return await res.json();
    } catch (err) {
      error = Number((err as any)?.statusCode) || null;
      return null;
    }
  };

  data = await query<T>(options);

  if (error === 401) {
    const refreshToken = cookieStore.get('refreshToken');

    if (refreshToken) {
      const res = await query<boolean>(authService.refreshArgs());

      if (res) {
        data = await query(options);
      }
    }
  }

  return { data, error, newCookies };
};
export default serverFetch;
