export interface IAppPage {
  params: Promise<Record<string, string | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
