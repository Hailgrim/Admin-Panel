import d from '~/locales/dictionary';
import type { LangList } from '~/locales/types';

/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export function testString(regex: RegExp, payload: string): boolean {
  return new RegExp(regex).test(payload);
}

/**
 * @param {Partial<T>} oldObject Original object
 * @param {Partial<T>} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export function getUpdatedValues<T>(
  oldObject: Partial<T>,
  newObject: Partial<T>
): Partial<T> {
  const result: Partial<T> = {};
  for (const value in newObject) {
    if (newObject[value] !== oldObject[value]) result[value] = newObject[value];
  }
  return result;
}

/**
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
export function makeErrorText(error: unknown, lang: string = 'en'): string {
  const currLang: LangList = lang in d ? (lang as LangList) : 'en';
  let result = d[currLang].unknownError;

  if (!(error instanceof Object)) return result;

  if ('status' in error) {
    if (error.status === 429) return d[currLang].tooManyRequests;

    if ('message' in error) {
      if (Array.isArray(error.message))
        result = (error.message as Array<string>).join('.\r\n').concat('.');
      else result = String(error.message);
    }
  }

  return result;
}
