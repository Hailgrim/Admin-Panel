import { ListItemButton, styled } from '@mui/material';
import React from 'react';

import theme from '../../lib/theme';
import LinkStyled from '../Other/LinkStyled';
import { SIDE_MENU_WIDTH_OPENED } from '../../lib/constants';

const ListItemButtonStyled = styled(
  ListItemButton,
  {
    shouldForwardProp: prop => !(['isChild',
    ] as PropertyKey[]).includes(prop),
  },
)<{
  isChild?: boolean;
}>(({ isChild }) => ({
  paddingLeft: isChild ? theme.spacing(3.5) : theme.spacing(2),
  minWidth: SIDE_MENU_WIDTH_OPENED,
}));

const MenuRowStyled: React.FC<{
  children?: React.ReactNode;
  href?: string;
  isChild?: boolean;
  selected?: boolean;
  onClick?: () => void;
}> = ({ children, href, isChild, selected, onClick }) => {
  const content = (
    <ListItemButtonStyled
      isChild={isChild}
      selected={selected}
      onClick={onClick}
    >
      {children}
    </ListItemButtonStyled>
  );
  return (
    <React.Fragment>
      {
        href
          ? <LinkStyled href={href}>{content}</LinkStyled>
          : content
      }
    </React.Fragment>
  );
};
export default MenuRowStyled;
