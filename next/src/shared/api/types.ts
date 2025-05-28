export interface IFetchRes<T = unknown> {
  data: T | null;
  error: number | null;
  newCookiesRaw?: string[] | null;
}

export interface IReqArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, unknown>;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  mode?: RequestMode;
}
