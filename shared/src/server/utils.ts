import * as fs from 'fs';

/**
 * @param {string} path Path to file with secret
 * @returns {string | undefined} File contents or undefined
 */
export const readSecret = (path: string): string | undefined => {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.warn(error.message);
    }

    return undefined;
  }
};
