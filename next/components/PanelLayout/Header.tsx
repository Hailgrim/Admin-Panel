import React from 'react';
import {
  AppBar,
  Button,
  IconButton,
  styled,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import lang from '../../libs/lang';
import authApi from '../../store/api/authApi';
import { toggleModalSideBar, toggleSideBar } from '../../store/slices/appSlice';
import theme from '../../libs/theme';
import { SIDE_MENU_WIDTH, SIDE_MENU_WIDTH_OPENED } from '../../libs/constants';
import { ROUTES } from '../../libs/config';

const AppBarStyled = styled(
  AppBar,
  {
    shouldForwardProp: prop => !([
      'openStyled',
    ] as PropertyKey[]).includes(prop),
  },
)<{
  openStyled?: boolean;
}>(({ openStyled }) => ({

  position: 'fixed',
  paddingLeft: openStyled ? SIDE_MENU_WIDTH_OPENED : SIDE_MENU_WIDTH,
  transition: theme.transitions.create('padding-left', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.short,
  }),

  [theme.breakpoints.down('md')]: {
    paddingLeft: 'unset',
  },

}));

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const isSideBarOpened = useAppSelector(store => store.app.isSideBarOpened);
  const isModalSideBarOpened = useAppSelector(store => store.app.isModalSideBarOpened);
  const [signOut, { data, error, isLoading }] = authApi.useSignOutMutation();
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    if (isLoading) return;
    if (error) return;
    if (data) router.push(ROUTES.auth.signIn);
  }, [data, error, isLoading, router]);

  return (
    <AppBarStyled openStyled={isSideBarOpened}>
      <Toolbar sx={{ pl: 0 }}>
        <IconButton
          size="large"
          sx={{ ml: downSM ? 1 : -2 }}
          onClick={() => downMD
            ? dispatch(toggleModalSideBar(!isModalSideBarOpened))
            : dispatch(toggleSideBar(!isSideBarOpened))
          }
        >
          <MenuIcon />
        </IconButton>
        {
          downMD
            ? (
              <IconButton
                size="large"
                color="error"
                onClick={() => signOut()}
                disabled={isLoading || data}
                sx={{ ml: 'auto', mr: downSM ? -1 : -2 }}
              >
                <LogoutIcon />
              </IconButton>
            )
            : (
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => signOut()}
                disabled={isLoading || data}
                sx={{ ml: 'auto' }}
              >
                {isLoading ? lang.get(userLang)?.loading : lang.get(userLang)?.signOut}
              </Button>
            )
        }
      </Toolbar>
    </AppBarStyled>
  );
};
export default Header;
