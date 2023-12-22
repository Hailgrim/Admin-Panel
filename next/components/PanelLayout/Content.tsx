import { Box, BoxProps, styled, Toolbar } from '@mui/material';

import { useAppSelector } from '../../store/hooks';
import theme from '../../lib/theme';
import { SIDE_MENU_WIDTH, SIDE_MENU_WIDTH_OPENED } from '../../lib/constants';

const BoxStyled = styled(
  (props: BoxProps<'main'>) => <Box component="main" {...props} />,
  {
    shouldForwardProp: (prop) =>
      !(['openStyled'] as PropertyKey[]).includes(prop),
  }
)<{
  openStyled?: boolean;
}>(({ openStyled }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  flexGrow: 1,
  paddingLeft: openStyled ? SIDE_MENU_WIDTH_OPENED : SIDE_MENU_WIDTH,
  transition: theme.transitions.create('padding-left', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.short,
  }),
  [theme.breakpoints.down('md')]: {
    paddingLeft: 'unset',
  },
}));

const BoxBodyStyled = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'baseline',
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

const Content: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const isSideBarOpened = useAppSelector((store) => store.app.isSideBarOpened);

  return (
    <BoxStyled openStyled={isSideBarOpened}>
      <Toolbar />
      <BoxBodyStyled>{children}</BoxBodyStyled>
    </BoxStyled>
  );
};
export default Content;
