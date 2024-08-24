'use server';

import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';

import authService from './auth/authService';
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
  options: IReqArgs
): Promise<IFetchRes<T>> => {
  const headersList = headers();
  const cookieStore = cookies();
  let data: T | null = null;
  let error: number | null = null;
  let newCookies: ResponseCookie[] | null = null;
  let newCookiesRaw: string | null = headersList.get('set-cookie');

  const query = async <U>(payload: IReqArgs): Promise<U | null> => {
    try {
      let url = `${process.env.INTERNAL_API_HOST}${payload.url}`;
      if (payload.params) {
        url += `?${new URLSearchParams(
          payload.params as Record<string, string>
        )}`;
      }

      const options: RequestInit = {
        ...payload,
        body: JSON.stringify(payload.body),
      };
      options.headers ??= {};

      (options.headers as Record<string, string>)[
        'cookie'
      ] = `${cookieStore.toString()}${
        newCookiesRaw ? `; ${newCookiesRaw}` : ''
      }`;

      const userAgent = headersList.get('user-agent');
      if (userAgent) {
        (options.headers as Record<string, string>)['user-agent'] = userAgent;
      }

      const res = await fetch(url, options);

      if (res.status >= 400) {
        error = res.status;
        return null;
      } else if (res.status >= 200) {
        error = null;
      }

      const rawCookies = res.headers.getSetCookie();
      if (rawCookies.length > 0) {
        newCookiesRaw = rawCookies[0];
        newCookies = newCookiesRaw.split(', ').map(parseRawCookies);
      }

      return await res.json();
    } catch (err) {
      error = Number((err as Record<string, unknown>)?.statusCode) || null;
      return null;
    }
  };

  data = await query<T>(options);

  if (error === 401) {
    const res = await query<boolean>(authService.refreshArgs());

    if (res) {
      data = await query(options);
    }
  }

  return { data, error, newCookies };
};
export default serverFetch;
