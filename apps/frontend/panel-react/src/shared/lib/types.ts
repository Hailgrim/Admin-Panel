export interface IList<T = unknown> {
  rows?: T[];
  page?: number;
  limit?: number;
  count?: number;
  onPageUpdate?: (page: number) => void;
  onLimitUpdate?: (limit: number) => void;
}
