import { CookieSerializeOptions } from '@fastify/cookie';

import { ACCESS_TOKEN_LIFETIME, NGINX_HOST } from 'libs/config';

/**
 * @param {string} payload Raw cookies
 * @returns {Object} Cookies in the form of an object
 */
export const getCookies = (payload: string = ''): Record<string, string> => {
  return Object.fromEntries(
    payload.split(';').map((value) => value.trim().split('=')),
  );
};

/**
 * @returns {string} Random string of 4 digits
 */
export const generateCode = (): string => {
  return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
};

/**
 * @param {number} maxAge Time in seconds
 * @returns {CookieSerializeOptions} Object with universal cookie parameters
 */
export const createCookieOptions = (
  maxAge: number = ACCESS_TOKEN_LIFETIME,
): CookieSerializeOptions => {
  return {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge,
    domain: `.${NGINX_HOST}`,
  };
};
