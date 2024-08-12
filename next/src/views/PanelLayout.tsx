import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

import useT from '@/shared/hooks/useT';
import { ROUTES } from '@/shared/lib/constants';
import useLang from '@/shared/hooks/useLang';
import theme, { sideBarOpenedWidth, sideBarWidth } from '@/shared/lib/theme';
import { IClientPage } from './types';
import { useAppDispatch } from '@/shared/store/hooks';
import authApi from '@/shared/api/auth/authApi';
import { addAlert } from '@/shared/store/main/main';
import { makeErrorText } from '@/shared/lib/utils';
import SideBar from '@/widgets/SideBar/SideBar';
import Alerts from '@/widgets/Alerts/Alerts';

const PanelLayout: FC<IClientPage & PropsWithChildren> = ({ h1, children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [open, setOpen] = useState(true);
  const [signOut, { data, error, isLoading }] = authApi.useSignOutMutation();

  useEffect(() => {
    if (data) router.push(ROUTES.ui.signIn);
  }, [data, router]);

  useEffect(() => {
    if (error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(error, lang.current),
        })
      );
    }
  }, [dispatch, error, lang]);

  return (
    <Box display="flex" flexDirection="row">
      <SideBar open={open} setOpen={() => setOpen((prev) => !prev)} />
      <Box flexGrow={1} overflow="hidden">
        <AppBarStyled
          openStyled={open}
          position="fixed"
          variant="elevation"
          elevation={0}
        >
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 'auto' }}
              onClick={() => setOpen((prev) => !prev)}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              edge="end"
              color="error"
              aria-label="sign out"
              title={t.signOut}
              disabled={isLoading || data}
              onClick={() => signOut()}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
          <Divider />
        </AppBarStyled>
        <Box component="main" sx={{ py: 1, px: 3, mt: 6 }}>
          <Typography component="h1" variant="h5" sx={{ my: 1 }}>
            {h1}
          </Typography>
          {children}
        </Box>
      </Box>
      <Alerts />
    </Box>
  );
};
export default PanelLayout;

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) =>
    !(['openStyled'] as PropertyKey[]).includes(prop),
})<{ openStyled?: boolean }>(({ openStyled }) => ({
  width: 'auto',
  left: openStyled ? sideBarOpenedWidth : sideBarWidth,
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.short,
  }),
  [theme.breakpoints.down('md')]: {
    left: 0,
  },
}));
