export interface IAlert {
  id: number;
  text?: string;
  type?: 'error' | 'warning' | 'success';
  deleted?: boolean;
}

export interface IWindowMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface IMenuItem<T = unknown> {
  title?: string;
  href?: string;
  icon?: T;
  childs?: IMenuItem<T>[];
}
