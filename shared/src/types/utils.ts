export type WithoutNulls<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
