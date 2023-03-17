import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { ISideBarItem } from '../../libs/types';
import { checkActiveLink } from '../../libs/functions';
import { useAppDispatch } from '../../store/hooks';
import { toggleModalSideBar } from '../../store/slices/appSlice';
import theme from '../../libs/theme';
import LinkUnstyled from '../Other/LinkUnstyled';
import { SIDE_MENU_WIDTH_OPENED } from '../../libs/constants';

const ListItemButtonStyled = styled(
  ListItemButton,
  {
    shouldForwardProp: prop => !([
      'isChild',
    ] as PropertyKey[]).includes(prop),
  },
)<{
  isChild?: boolean;
}>(({ isChild }) => ({
  paddingLeft: isChild ? theme.spacing(3.5) : theme.spacing(2),
  minWidth: SIDE_MENU_WIDTH_OPENED,
}));

const ItemParent: React.FC<{
  children?: React.ReactNode;
  href?: string;
}> = ({ children, href }) => {
  return (
    <React.Fragment>
      {
        href
          ? <LinkUnstyled href={href}>{children}</LinkUnstyled>
          : <React.Fragment>{children}</React.Fragment>
      }
    </React.Fragment>
  );
};

const SideBarItem: React.FC<ISideBarItem> = ({ link, name, icon, childs, isChild, disabled }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isChildsOpened, setChildsVisibility] = React.useState<boolean>(checkActiveLink(router.pathname, { link, childs }));

  const clickHandler = () => {
    if (childs && childs.length > 0) {
      setChildsVisibility(!isChildsOpened);
    }
    if (link !== undefined) {
      dispatch(toggleModalSideBar(false));
    }
  };

  const selected = React.useMemo(() => {
    let result = Boolean(link);
    const pathArr = router.pathname.split('/');
    const linkArr = link ? link.split('/') : [];
    linkArr.forEach((value, index) => {
      if (value != pathArr[index]) {
        result = false;
      }
    });
    return result;
  }, [router.pathname, link]);

  return disabled === true
    ? <React.Fragment />
    : (
      <React.Fragment>
        <ItemParent href={link}>
          <ListItemButtonStyled
            isChild={isChild}
            selected={selected}
            onClick={clickHandler}
          >
            <ListItemIcon sx={{ px: 0.5 }}>{icon}</ListItemIcon>
            <ListItemText primary={name} sx={{ whiteSpace: 'nowrap' }} />
            {childs && isChildsOpened && <ExpandLess />}
            {childs && !isChildsOpened && <ExpandMore />}
          </ListItemButtonStyled>
        </ItemParent>
        {childs && childs.length > 0 && (
          <Collapse in={isChildsOpened} timeout="auto">
            <List component="div" disablePadding>
              {childs.map((child, index) => (
                <SideBarItem
                  key={`SideBarItem.${name}.${index}`}
                  {...child}
                  isChild
                />
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
};
export default SideBarItem;
