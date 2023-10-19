import { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { ICreateCookieOptions, IPage, IPagination, IRole, ISideBarItem } from './types';
import { AppStore, wrapper } from '../store/store';
import { setAuthTokens, setProfile, setUserAgent } from '../store/slices/appSlice';
import authApi from '../store/api/authApi';
import lang, { LangList } from './lang';
import { ACCESS_TOKEN_LIFETIME, HOST, PROJECT_TAG, REFRESH_TOKEN_LIFETIME } from './config';
import { ROUTES, Rights } from './constants';

/**
 * @param {string} link Checked link
 * @returns {boolean} true if link found in the navigation tree
 */
export const checkActiveLink = (link: string, navTree: ISideBarItem): boolean => {
  const result =
    (navTree.link && link.startsWith(navTree.link)) ||
    !!navTree.childs?.some(nav => checkActiveLink(link, nav));
  return result;
};

/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export const testString = (regex: RegExp, payload: string): boolean => {
  return new RegExp(regex).test(payload);
};

/**
 * Recognize a section by url
 * @param {string} url - URL string
 */
export const routeSection = (url: string): keyof typeof ROUTES | undefined => {
  if (
    Object
      .values(ROUTES.auth)
      .some(route => route === url)
  ) {
    return 'auth';
  }
  if (
    Object
      .values(ROUTES.panel)
      .some(route => route === url)
  ) {
    return 'panel';
  }
  return undefined;
};

/**
 * @param {any} page - Page number
 * @param {any} quantity - Page size
 * @returns {IPagination} Pagination object
 */
export const makePagination = (query: ParsedUrlQuery): IPagination => {
  const page = Math.abs(Number(query.page)) || 1;
  let quantity = Number(query.quantity);
  if (![25, 50, 100].includes(quantity)) {
    quantity = 100;
  }
  return { page, quantity };
};

/**
 * @param {Partial<T>} oldObject Original object
 * @param {Partial<T>} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export const getUpdatedValues = <T>(oldObject: Partial<T>, newObject: Partial<T>): Partial<T> => {
  const result: Partial<T> = {};
  for (const value in newObject) {
    if (newObject[value] != oldObject[value]) {
      result[value] = newObject[value];
    }
  }
  return result;
};

/**
 * @param {any} error Some request error
 * @param {LangList} userLang Error language
 * @returns {string} Formatted error text
 */
export const makeErrorText = (
  error?: string | number | FetchBaseQueryError | SerializedError,
  userLang: LangList = 'en',
): string => {
  let result = String(lang.get(userLang)?.unknownError);

  if (
    error === undefined ||
    typeof error == 'string' ||
    typeof error == 'number'
  ) {
    return result;
  }

  if ('status' in error && error.status == 429) {
    return String(lang.get(userLang)?.tooManyRequests);
  }

  const errorObj = Object(error);
  if (errorObj?.data?.message) {
    if (Array.isArray(errorObj.data.message)) {
      result = (errorObj.data.message as Array<string>).join('; ').concat('.');
    } else {
      result = String(errorObj.data.message);
    }
  }

  return result;
};

/**
 * @param {string} route Route name (e. g. "users" or "users/some")
 * @param {Rights} rights Route rights
 * @param {IRole | IRole[]} roles User roles
 * @returns {boolean} true if the user has the necessary rights
 */
export const isAllowed = (
  route: string,
  rights: Rights,
  roles?: IRole | IRole[],
): boolean => {
  if (route.startsWith('/')) {
    route = route.slice(1);
  }
  let result = false;
  const data = Array.isArray(roles)
    ? roles
    : roles
      ? [roles]
      : undefined;

  data?.forEach(role => {
    if (role.admin) {
      result = true;
    } else {
      role.resources?.forEach(resource => {
        if (
          resource.path == route &&
          resource.RolesResources?.[rights] === true
        ) {
          result = true;
        }
      });
    }
  });

  return result;
};

/**
 * @param {string} name Cookie name
 * @param {string} value Cookie value
 * @param {ICreateCookieOptions} options Cookie options
 * @returns {string} Final cookie string
 */
export function createCookie(name: string, value: string | null, options?: ICreateCookieOptions): string {
  let result = `${name}${value ? `=${value}` : ''}`;
  if (options) {
    if (options.httpOnly) result = result.concat(';HttpOnly');
    if (options.sameSite) result = result.concat(`;SameSite=${options.sameSite}`);
    if (options.secure) result = result.concat(';Secure');
    if (options.path) result = result.concat(`;Path=${options.path}`);
    if (options.domain) result = result.concat(`;Domain=${options.domain}`);
    if (options.maxAge) result = result.concat(`;MaxAge=${options.maxAge}`);
  }
  return result;
}

/**
 * HOC for wrapper.getServerSideProps with authorization request
 */
export const getServerSidePropsCustom = <T = void>(
  func: (payload: {
    store: AppStore,
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  }) => Promise<GetServerSidePropsResult<IPage<T>>>,
) => {
  return wrapper.getServerSideProps<IPage<T>>(store => async (ctx) => {
    let accessToken = ctx.req.cookies[`${PROJECT_TAG}_accessToken`] || null;
    let refreshToken = ctx.req.cookies[`${PROJECT_TAG}_refreshToken`] || null;
    const rememberMe = ctx.req.cookies[`${PROJECT_TAG}_rememberMe`] !== undefined;
    const isAuthPageRequest = routeSection(ctx.resolvedUrl.split('?')[0]) == 'auth';
    const userAgent = ctx.req.headers['user-agent'];

    if (userAgent) {
      store.dispatch(setUserAgent(userAgent));
    }

    if (refreshToken && !accessToken) {
      store.dispatch(setAuthTokens({ accessToken, refreshToken, rememberMe }));
      const { data } = await store.dispatch(authApi.endpoints.refresh.initiate());
      if (data) {
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
        const cookieOptions: ICreateCookieOptions = {
          domain: `.${HOST}`,
          httpOnly: true,
          path: '/',
          sameSite: 'None',
          secure: true
        };
        ctx.res.setHeader(
          'Set-Cookie',
          [
            createCookie(`${PROJECT_TAG}_accessToken`, accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_LIFETIME }),
            createCookie(
              `${PROJECT_TAG}_refreshToken`,
              refreshToken,
              { ...cookieOptions, maxAge: rememberMe ? REFRESH_TOKEN_LIFETIME : ACCESS_TOKEN_LIFETIME * 2 },
            ),
          ],
        );
      }
    }

    if (accessToken) {
      store.dispatch(setAuthTokens({ accessToken, refreshToken, rememberMe }));
      const { data } = await store.dispatch(authApi.endpoints.getProfile.initiate());
      if (data) {
        if (isAuthPageRequest) return { redirect: { destination: '/', statusCode: 302 } };
        store.dispatch(setProfile(data));
        const props = await func({ store, context: ctx });
        store.dispatch(setAuthTokens({ accessToken: null, refreshToken: null, rememberMe: false }));
        store.dispatch(setUserAgent(null));
        return props;
      }
    }

    if (isAuthPageRequest) {
      return { ...await func({ store, context: ctx }) };
    } else {
      return { redirect: { destination: '/authorization', statusCode: 302 } };
    }
  });
};
