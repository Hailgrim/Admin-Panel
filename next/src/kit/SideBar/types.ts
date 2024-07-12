import { ReactNode } from 'react';

export interface IMenuItem {
  href?: string;
  text?: string;
  icon?: ReactNode;
  childs?: IMenuItem[];
}
