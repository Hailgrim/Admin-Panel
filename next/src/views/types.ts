export interface IServerPage<T = void, U = void> {
  params: T extends void ? Record<string, string | undefined> : T;
  searchParams: U extends void ? Record<string, string | undefined> : U;
}

export interface IClientPage<T = unknown> {
  h1?: string;
  data?: T | null;
}
