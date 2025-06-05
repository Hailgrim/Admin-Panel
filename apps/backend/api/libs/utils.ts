import { CookieSerializeOptions } from '@fastify/cookie';
import { FastifyRequest } from 'fastify';
import { hash, verify } from 'argon2';
import * as crypto from 'crypto';

import { cfg } from 'config/configuration';

/**
 * @returns {string} Random string of 4 digits
 */
export const generateCode = (): string => {
  return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
};

/**
 * @param {string | undefined} payload Data to be hashed
 * @returns {string} Hash string generated from payload
 */
export const createHash = (payload?: string): Promise<string> =>
  hash(payload || crypto.randomBytes(10));

/**
 * @param {number} hash The hash to be recognized
 * @param {number} data Original data for verification
 * @returns {boolean} Verification result
 */
export const verifyHash = (hash: string, data: string): Promise<boolean> =>
  verify(hash, data);

/**
 * @param {number} maxAge Time in seconds
 * @returns {CookieSerializeOptions} Object with universal cookie parameters
 */
export const createCookieOptions = (
  maxAge: number = cfg.tokens.access.lifetime,
): CookieSerializeOptions => {
  return {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge,
    domain: `.${cfg.urls.main}`,
  };
};

/**
 * @returns {string} User IP from request
 */
export const getIP = (req: FastifyRequest): string => {
  return req.ips?.length ? req.ips[0] : req.ip;
};
