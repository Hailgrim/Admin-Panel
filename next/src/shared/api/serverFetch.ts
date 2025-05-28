'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';

import authService from './auth/authService';
import { IFetchRes, IReqArgs } from './types';

const serverFetch = async <T = unknown>(
  options: IReqArgs
): Promise<IFetchRes<T>> => {
  const headersList = await headers();
  const cookieStore = await cookies();
  let data: T | null = null;
  let error: number | null = null;
  let newCookiesRaw: string[] | null = null;

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

      newCookiesRaw = res.headers.getSetCookie();

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

  return { data, error, newCookiesRaw };
};
export default serverFetch;
