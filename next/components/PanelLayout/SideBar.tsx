import {
  Box,
  Divider,
  Drawer,
  DrawerProps,
  IconButton,
  List,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import lang from '../../lib/lang';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleModalSideBar, toggleSideBar } from '../../store/slices/appSlice';
import theme from '../../lib/theme';
import { SIDE_MENU_WIDTH, SIDE_MENU_WIDTH_OPENED } from '../../lib/constants';
import MenuItems from './MenuItems';

const DrawerStyled = styled(
  (props: DrawerProps) => <Drawer variant="permanent" open={true} {...props} />,
  {
    shouldForwardProp: prop => !([
      'openStyled',
      'openModalStyled',
    ] as PropertyKey[]).includes(prop),
  },
)<{
  openStyled?: boolean;
  openModalStyled?: boolean;
}>(({ openStyled, openModalStyled }) => ({

  '& > .MuiDrawer-paper': {

    maxWidth: '100%',
    width: openStyled ? SIDE_MENU_WIDTH_OPENED : SIDE_MENU_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.short,
    }),

    [theme.breakpoints.down('md')]: {
      width: openModalStyled ? SIDE_MENU_WIDTH_OPENED : 0,
      overflow: 'hidden',
    },

  },

}));

const DrawerHeaderStyled = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  overflowX: 'hidden',
  ...theme.mixins.toolbar,
}));

const SideBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const isSideBarOpened = useAppSelector(store => store.app.isSideBarOpened);
  const isModalSideBarOpened = useAppSelector(store => store.app.isModalSideBarOpened);
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DrawerStyled
      openStyled={isSideBarOpened}
      openModalStyled={isModalSideBarOpened}
    >
      <DrawerHeaderStyled>
        <IconButton
          size="large"
          sx={{ mx: 1, my: downSM ? 0 : 1 }}
          onClick={() => downMD
            ? dispatch(toggleModalSideBar(!isModalSideBarOpened))
            : dispatch(toggleSideBar(!isSideBarOpened))
          }
        >
          <AdminPanelSettingsIcon />
        </IconButton>
        <Typography
          component="span"
          variant="h6"
          sx={{ pl: 1 }}
          noWrap
        >
          {lang.get(userLang)?.adminPanel}
        </Typography>
      </DrawerHeaderStyled>
      <Divider />
      <List
        component="nav"
        aria-label={lang.get(userLang)?.mainMenu}
        sx={{ overflowX: 'hidden' }}
      >
        <MenuItems />
      </List>
    </DrawerStyled>
  );
};
export default SideBar;
