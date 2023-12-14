import { AppBar, styled } from '@mui/material';

import theme from '../../lib/theme';
import { SIDE_MENU_WIDTH, SIDE_MENU_WIDTH_OPENED } from '../../lib/constants';

const AppBarStyled = styled(
  AppBar,
  { shouldForwardProp: prop => !(['openStyled'] as PropertyKey[]).includes(prop) },
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
export default AppBarStyled;
