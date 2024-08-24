/**
 * @param {number | string} page Page for window search params
 */
export const setPage = (page: number | string) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('page', String(page));
  history.pushState(null, '', `?${queryParams.toString()}`);
};

/**
 * @param {number | string} quantity Quantity for window search params
 */
export const setQuantity = (quantity: number | string) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('quantity', String(quantity));
  history.pushState(null, '', `?${queryParams.toString()}`);
};
