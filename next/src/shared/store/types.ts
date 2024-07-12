export interface IAlert {
  id: number;
  text?: string;
  type?: 'error' | 'warning' | 'success';
  deleted?: boolean;
}
