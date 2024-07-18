import { appendResponseHeader } from 'h3';

import type { IReqError } from './types';

export function useCustomFetch<ResT = void, ReqT = void>(
  init: (payload: ReqT) => {
    url: string;
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      params?: Record<string, unknown>;
      body?: unknown;
      credentials?: RequestCredentials;
    };
  }
) {
  const event = useRequestEvent();
  const config = useRuntimeConfig();
  const accessToken = useCookie('accessToken');
  const refreshToken = useCookie('refreshToken');
  const rememberMe = useCookie('rememberMe');
  const payload = ref<ReqT | null>(null) as Ref<ReqT | null>;
  const pending = ref(false);
  const error = ref<IReqError | null>(null);
  const data = ref<ResT | null>(null) as Ref<ResT | null>;
  const refreshed = ref(false);

  const defaultOptions: object = {
    mode: 'cors',
    timeout: 5000,
    baseURL: import.meta.client
      ? `https://api.${config.public.NGINX_HOST}`
      : `http://${config.public.NEST_CORE_HOST}:${config.public.NEST_CORE_PORT}`,
  };

  async function refreshTokens() {
    if (import.meta.server && !refreshToken.value) return null;

    const refreshOptions = {
      method: 'GET' as 'GET' | 'POST',
      credentials: 'include' as RequestCredentials,
      headers: import.meta.server
        ? {
            Cookie: `refreshToken=${refreshToken.value}`.concat(
              rememberMe.value ? ';rememberMe=true' : ''
            ),
          }
        : undefined,
    };

    try {
      const res = await $fetch.raw<boolean>(ROUTES.api.auth.refresh, {
        ...defaultOptions,
        ...refreshOptions,
      });
      if (import.meta.server) {
        const cookies = (res.headers.get('set-cookie') || '').split(',');
        for (const cookie of cookies)
          event && appendResponseHeader(event, 'set-cookie', cookie);
      }
      return res._data;
    } catch {
      return null;
    }
  }

  async function customFetch(arg: ReqT): Promise<ResT | null> {
    const query = init(arg);
    pending.value = true;

    try {
      const resolve = await $fetch<ResT>(query.url, {
        ...defaultOptions,
        ...query.options,
        body: query.options.body
          ? (query.options.body as Record<string, unknown> | BodyInit)
          : undefined,
        headers: {
          'Content-Type':
            typeof arg === 'object'
              ? 'application/json'
              : 'text/plain;charset=UTF-8',
          ...(import.meta.server && accessToken.value
            ? { Cookie: `accessToken=${accessToken.value}` }
            : undefined),
        },
      });

      error.value = null;
      data.value = resolve;
      pending.value = false;
      return resolve;
    } catch (fail) {
      const fetchError: IReqError = {
        status: Number((fail as Record<string, unknown>).status) || 400,
        message: String((fail as Record<string, unknown>).message),
      };

      // Trying to refresh tokens and refetch query
      if (fetchError.status === 401 && refreshed.value === false) {
        refreshed.value = true;
        const success = await refreshTokens();
        if (success) return customFetch(arg);
      }

      error.value = fetchError;
      pending.value = false;
      return null;
    }
  }

  async function execute(arg: ReqT) {
    if (payload.value === arg && error.value === null) return data.value;
    return refresh(arg);
  }

  async function refresh(arg: ReqT) {
    refreshed.value = false;
    payload.value = arg;
    return customFetch(arg);
  }

  return { pending, error, data, execute, refresh };
}
