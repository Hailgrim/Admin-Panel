import { GridPaginationModel } from '@mui/x-data-grid';

export interface IList<T = unknown> {
  rows?: T[];
  count?: number;
  page?: number;
  quantity?: number;
  onPaginationUpdate?: (model: GridPaginationModel) => void;
}
