import { IMenuItem, LangList } from './types';
import d from '../locales/dictionary';

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
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export const testString = (regex: RegExp, payload: string): boolean => {
  return new RegExp(regex).test(payload);
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
 * @param {any} error Some request error
 * @param {LangList} lang Error language
 * @returns {string} Formatted error text
 */
export const makeErrorText = (
  error?: unknown,
  lang: LangList | string = 'en'
): string => {
  const currLang: LangList = String(lang) in d ? (lang as LangList) : 'en';
  let result = String(d[currLang].unknownError);

  if (!(error instanceof Object)) {
    return result;
  }

  if ('status' in error) {
    if (error.status === 429) {
      return String(d[currLang].tooManyRequests);
    }

    if (
      'data' in error &&
      error.data instanceof Object &&
      'message' in error.data
    ) {
      if (Array.isArray(error.data.message)) {
        result = (error.data.message as Array<string>)
          .join('.\r\n')
          .concat('.');
      } else {
        result = String(error.data.message);
      }
    }
  }

  return result;
};
