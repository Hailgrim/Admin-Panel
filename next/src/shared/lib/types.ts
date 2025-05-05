export type WithoutNulls<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export interface IList<T = unknown> {
  rows?: T[];
  count?: number;
  page?: number;
  quantity?: number;
  onPageUpdate?: (page: number) => void;
  onQuantityUpdate?: (quantity: number) => void;
}
