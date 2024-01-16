import { FC } from 'react';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { styled } from '@mui/material/styles';

import useT from '@/hooks/useT';
import SideBarMenu from './SideBarMenu';
import theme, { sideBarOpenedWidth, sideBarWidth } from '@/lib/theme';

const SideBar: FC<{ open?: boolean; setOpen?: () => void }> = ({
  open,
  setOpen,
}) => {
  const t = useT();

  return (
    <DrawerStyled openStyled={open} openMdStyled={!open}>
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton onClick={setOpen}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t.adminPanel} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <SideBarMenu />
    </DrawerStyled>
  );
};
export default SideBar;

const DrawerStyled = styled(
  (props: DrawerProps) => (
    <Drawer variant="permanent" anchor="left" open={true} {...props} />
  ),
  {
    shouldForwardProp: (prop) =>
      !(['openStyled', 'openMdStyled'] as PropertyKey[]).includes(prop),
  }
)<{ openStyled?: boolean; openMdStyled?: boolean }>(
  ({ openStyled, openMdStyled }) => ({
    width: openStyled ? sideBarOpenedWidth : sideBarWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.short,
    }),
    [theme.breakpoints.down('md')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: openMdStyled ? sideBarOpenedWidth : 0,
    },
    '& > .MuiDrawer-paper': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      maxWidth: '100%',
      width: openStyled ? sideBarOpenedWidth : sideBarWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.short,
      }),
      [theme.breakpoints.down('md')]: {
        width: openMdStyled ? sideBarOpenedWidth : 0,
      },
      '& > *': {
        width: sideBarOpenedWidth,
      },
    },
  })
);
