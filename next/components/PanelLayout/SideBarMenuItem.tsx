import { Collapse, List, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { IMenuItem } from '../../lib/types';
import { checkActiveLink } from '../../lib/functions';
import { useAppDispatch } from '../../store/hooks';
import { toggleModalSideBar } from '../../store/slices/appSlice';
import MenuRowStyled from './MenuRowStyled';

const SideBarMenuItem: React.FC<IMenuItem> = ({ href, name, icon, childs, isChild, disabled }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isChildsOpened, setChildsVisibility] = React.useState(() => checkActiveLink(router.pathname, { href, childs }));

  const clickHandler = () => {
    if (childs && childs.length > 0) {
      setChildsVisibility(!isChildsOpened);
    }
    if (href !== undefined) {
      dispatch(toggleModalSideBar(false));
    }
  };

  const selected = React.useMemo(() => {
    let result = Boolean(href);
    const pathArr = router.pathname.split('/');
    const linkArr = href ? href.split('/') : [];
    linkArr.forEach((value, index) => {
      if (value != pathArr[index]) {
        result = false;
      }
    });
    return result;
  }, [router.pathname, href]);

  return disabled === true
    ? <React.Fragment />
    : (
      <React.Fragment>
        <MenuRowStyled
          href={href}
          isChild={isChild}
          selected={selected}
          onClick={clickHandler}
        >
          <ListItemIcon sx={{ px: 0.5 }}>{icon}</ListItemIcon>
          <ListItemText primary={name} sx={{ whiteSpace: 'nowrap' }} />
          {childs && isChildsOpened && <ExpandLess />}
          {childs && !isChildsOpened && <ExpandMore />}
        </MenuRowStyled>
        {childs && childs.length > 0 && (
          <Collapse in={isChildsOpened} timeout="auto">
            <List component="div" disablePadding>
              {childs.map((child, index) => (
                <SideBarMenuItem
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
export default SideBarMenuItem;
