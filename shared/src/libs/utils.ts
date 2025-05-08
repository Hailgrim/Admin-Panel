import { getT } from '../locales/utils';
import { IMenuItem } from '../types/ui';
import { ROUTES } from './constants';

/**
 * @param {Date | string | number} date Parsed date
 * @returns {string} Formatted date string
 */
export const getDateString = (
  date: Date | string | number = Date.now()
): string => {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const now = Date.now();
  const parsedDate = new Date(date);
  const parsedTime = parsedDate.getTime();

  if (isNaN(parsedTime)) return '-';

  const differenceMS = now - parsedTime;
  const minuteMS = 1000 * 60;
  const hourMS = minuteMS * 60;
  const dayMS = hourMS * 24;

  if (differenceMS < minuteMS) {
    return rtf.format(0, 'minute');
  } else if (differenceMS < hourMS) {
    return rtf.format(-1 * Math.floor(differenceMS / minuteMS), 'minute');
  } else if (differenceMS < dayMS) {
    return rtf.format(-1 * Math.floor(differenceMS / hourMS), 'hour');
  } else {
    return parsedDate.toLocaleString();
  }
};

/**
 * @param {Partial<T>} oldObject Original object
 * @param {Partial<T>} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export const getUpdatedValues = <T>(
  oldObject: Partial<T>,
  newObject: Partial<T>
): Partial<T> => {
  const result: Partial<T> = {};

  for (const value in newObject) {
    if (newObject[value] !== oldObject[value]) result[value] = newObject[value];
  }

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
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
export const getErrorText = (error?: unknown, lang: string = 'en'): string => {
  const t = getT(lang);

  if (!(error instanceof Object)) {
    return t.unknownError;
  }

  if ('status' in error && error.status === 429) {
    return t.tooManyRequests;
  }

  let obj = error;

  if ('data' in obj && obj.data instanceof Object) {
    obj = obj.data;
  }

  if ('message' in obj) {
    console.log(obj.message);
    if (obj.message instanceof Array) {
      return obj.message.join('.\r\n').concat('.');
    } else if (typeof obj.message === 'string') {
      return obj.message;
    }
  }

  return t.unknownError;
};

/**
 * @param {string} href Checked link
 * @returns {boolean} true if link found in the navigation tree
 */
export const checkActiveLink = (href: string, navTree: IMenuItem): boolean => {
  if (navTree.href) {
    if (
      href === navTree.href ||
      href.startsWith(`${navTree.href}/`) ||
      href.startsWith(`${navTree.href}?`)
    ) {
      return true;
    }
  }

  if (navTree.childs) {
    return navTree.childs.some((nav) => checkActiveLink(href, nav));
  }

  return false;
};

/**
 * @param {string} state Random string
 * @returns {boolean} Google Login URL
 */
export const getGoogleSignInUrl = (
  googleClientId: string,
  redirectUri: string,
  state: string
): string => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${encodeURIComponent(googleClientId)}`;
  url += `&redirect_uri=${encodeURIComponent(
    `https://${redirectUri}${ROUTES.ui.signInGoogle}`
  )}`;
  url += `&scope=${encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.profile'
  )}`;
  url += `&state=${encodeURIComponent(state)}`;
  url += '&include_granted_scopes=true';
  url += '&response_type=token';
  return url;
};
