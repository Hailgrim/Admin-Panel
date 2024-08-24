import * as argon2 from 'argon2';

/**
 * @param {string} password The password that the hash will be based on
 * @returns {Promise<string>} Random string of 4 digits
 */
export const createPasswordHash = (password: string): Promise<string> => {
  return argon2.hash(password);
};
