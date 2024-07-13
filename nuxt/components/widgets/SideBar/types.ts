export interface IMenuItem {
  title: string;
  href?: string;
  icon?: string;
  childs?: IMenuItem[];
}
