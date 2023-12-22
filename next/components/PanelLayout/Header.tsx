import React from 'react';
import {
  Button,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import authApi from '../../store/api/authApi';
import { toggleModalSideBar, toggleSideBar } from '../../store/slices/appSlice';
import { ROUTES } from '../../lib/constants';
import AppBarStyled from './AppBarStyled';
import useT from 'hooks/useT';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useT();
  const isSideBarOpened = useAppSelector((store) => store.app.isSideBarOpened);
  const isModalSideBarOpened = useAppSelector(
    (store) => store.app.isModalSideBarOpened
  );
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
          onClick={() =>
            downMD
              ? dispatch(toggleModalSideBar(!isModalSideBarOpened))
              : dispatch(toggleSideBar(!isSideBarOpened))
          }
        >
          <MenuIcon />
        </IconButton>
        {downMD ? (
          <IconButton
            size="large"
            color="error"
            onClick={() => signOut()}
            disabled={isLoading || data}
            title={t.signOut}
            sx={{ ml: 'auto', mr: downSM ? -1 : -2 }}
          >
            <LogoutIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => signOut()}
            disabled={isLoading || data}
            title={t.signOut}
            sx={{ ml: 'auto' }}
          >
            {isLoading ? t.loading : t.signOut}
          </Button>
        )}
      </Toolbar>
    </AppBarStyled>
  );
};
export default Header;
