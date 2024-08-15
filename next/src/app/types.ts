export interface IAppPage<T = void, U = void> {
  params: T extends void ? Record<string, string | undefined> : T;
  searchParams: U extends void ? Record<string, string | undefined> : U;
}
