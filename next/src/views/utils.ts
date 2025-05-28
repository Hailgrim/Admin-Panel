/**
 * @param {number | string} page Page for window search params
 */
export const setReqPage = (page: number | string) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('reqPage', String(page));
  history.pushState(null, '', `?${queryParams.toString()}`);
};

/**
 * @param {number | string} limit Quantity for window search params
 */
export const setReqLimit = (limit: number | string) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('reqLimit', String(limit));
  history.pushState(null, '', `?${queryParams.toString()}`);
};
