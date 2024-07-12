import { IMenuItem } from './types';

/**
 * @param {string} href Checked link
 * @returns {boolean} true if link found in the navigation tree
 */
export const checkActiveLink = (href: string, navTree: IMenuItem): boolean => {
  if (navTree.href) {
    if (
      href === navTree.href ||
      href.startsWith(`${navTree.href}/`) ||
      href.startsWith(`${navTree.href}?`)
    ) {
      return true;
    }
  }

  if (navTree.childs) {
    return navTree.childs.some((nav) => checkActiveLink(href, nav));
  }

  return false;
};
