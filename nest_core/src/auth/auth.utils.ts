/**
 * @param {string} payload Raw cookies
 * @returns {Object} Cookies in the form of an object
 */
export const getCookies = (payload?: string): any => {
  return Object.fromEntries(
    String(payload)
      .split(';')
      .map((value) => value.trim().split('=')),
  );
};
