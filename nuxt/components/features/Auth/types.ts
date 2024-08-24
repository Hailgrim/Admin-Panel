export interface IWindowMessage<T = unknown> {
  type: string;
  payload: T;
}
