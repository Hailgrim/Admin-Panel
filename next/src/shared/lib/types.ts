export interface IList<T = unknown> {
  rows?: T[];
  count?: number;
  page?: number;
  quantity?: number;
  onPageUpdate?: (page: number) => void;
  onQuantityUpdate?: (quantity: number) => void;
}
