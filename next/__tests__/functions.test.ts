import { IMenuItem, LangList } from 'lib/types';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '../lib/constants';
import { checkActiveLink, getUpdatedValues, makeErrorText, testString } from '../lib/functions';
import dictionary from '../locales/dictionary';

describe('checkActiveLink function', () => {
  test('checkActiveLink should return true if link found in the navigation tree', () => {
    const href = '/test';

    const tree1: IMenuItem = {
      href: '/test?some=param',
      childs: [
        { href: '/bad/item' },
      ],
    };
    expect(checkActiveLink(href, tree1)).toBe(true);
    expect(checkActiveLink('/', tree1)).toBe(false);

    const tree2: IMenuItem = {
      href: '/bad',
      childs: [
        { href: '/test/item' },
      ],
    };
    expect(checkActiveLink(href, tree2)).toBe(true);

    const tree3: IMenuItem = {
      href: '/test',
      childs: [
        { href: '/test/item' },
      ],
    };
    expect(checkActiveLink(href, tree3)).toBe(true);

    const tree4: IMenuItem = {
      href: '/bad',
      childs: [
        { href: '/bad/item' },
      ],
    };
    expect(checkActiveLink(href, tree4)).toBe(false);

    const tree5: IMenuItem = {
      href: '/bad',
      childs: [
        { href: '/item/test' },
      ],
    };
    expect(checkActiveLink(href, tree5)).toBe(false);
  });
});

describe('testString function', () => {
  test('testString should return true for valid string with name pattern', () => {
    expect(testString(NAME_REGEX, 'valid string')).toBe(true);
    expect(testString(NAME_REGEX, 'v')).toBe(true);
    expect(testString(NAME_REGEX, '1')).toBe(true);
    expect(testString(NAME_REGEX, 'valid string!')).toBe(false);
    expect(testString(NAME_REGEX, '')).toBe(false);
    expect(testString(NAME_REGEX, new Array(8).fill('valid string').join(' '))).toBe(false);
  });
  test('testString should return true for valid string with email pattern', () => {
    expect(testString(EMAIL_REGEX, 'valid_email@example.com')).toBe(true);
    expect(testString(EMAIL_REGEX, 'v@e.co')).toBe(true);
    expect(testString(EMAIL_REGEX, '1@2.34')).toBe(true);
    expect(testString(EMAIL_REGEX, '*&^@example.com')).toBe(false);
    expect(testString(EMAIL_REGEX, 'example@*&^.com')).toBe(false);
    expect(testString(EMAIL_REGEX, 'example@example.*&^')).toBe(false);
    expect(testString(EMAIL_REGEX, '@example.com')).toBe(false);
    expect(testString(EMAIL_REGEX, 'valid_email@.com')).toBe(false);
    expect(testString(EMAIL_REGEX, 'valid_email@example.c')).toBe(false);
    expect(testString(EMAIL_REGEX, '')).toBe(false);
  });
  test('testString should return true for valid string with password pattern', () => {
    expect(testString(PASSWORD_REGEX, '!Q1q2w3e4r')).toBe(true);
    expect(testString(PASSWORD_REGEX, '1Q1q2w3e4r')).toBe(false);
    expect(testString(PASSWORD_REGEX, '!q1q2w3e4r')).toBe(false);
    expect(testString(PASSWORD_REGEX, '!Q!Q@W#E$R')).toBe(false);
    expect(testString(PASSWORD_REGEX, '')).toBe(false);
    expect(testString(PASSWORD_REGEX, new Array(10).fill('!Q1q2w3e4r').join(' '))).toBe(false);
  });
});

describe('getUpdatedValues function', () => {
  test('getUpdatedValues should return valid object', () => {
    const obj = {
      field1: 'value1',
      field2: 'value2',
    };

    const newObj1: Partial<typeof obj> = {
      field1: 'NEW VALUE',
    };
    expect(getUpdatedValues(obj, newObj1)).toEqual({ field1: 'NEW VALUE' });

    const newObj2: Partial<typeof obj> = {
      field1: 'NEW VALUE',
      field2: 'value2',
    };
    expect(getUpdatedValues(obj, newObj2)).toEqual({ field1: 'NEW VALUE' });

    const newObj3: Partial<typeof obj> = {};
    expect(getUpdatedValues(obj, newObj3)).toEqual({});
  });
});

describe('makeErrorText function', () => {
  test('makeErrorText should return valid error message', () => {
    const lang: LangList = 'en';
    expect(makeErrorText(undefined, lang)).toBe(dictionary[lang].unknownError);
    expect(makeErrorText('error', lang)).toBe(dictionary[lang].unknownError);
    expect(makeErrorText(404, lang)).toBe(dictionary[lang].unknownError);
    expect(makeErrorText({ status: 429, data: 'error' }, lang)).toBe(dictionary[lang].tooManyRequests);
    expect(makeErrorText({ status: 100, data: 'error' }, lang)).toBe(dictionary[lang].unknownError);
    expect(makeErrorText({ status: 100, data: { message: 'error' } }, lang)).toBe('error');
    expect(makeErrorText({ status: 100, data: { message: ['error1', 'error2', 'error3'] } }, lang)).toBe('error1; error2; error3.');
  });
});
