/**
 * @param {string} payload Raw cookies
 * @returns {Object} Cookies in the form of an object
 */
export const getCookies = (payload: string = ''): Record<string, string> => {
  return Object.fromEntries(
    payload.split(';').map((value) => value.trim().split('=')),
  );
};
