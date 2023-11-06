import { styled } from '@mui/material';
import Link from 'next/link';

import theme from '../../lib/theme';

const AuthLinkStyled = styled(Link)(() => ({

  ...theme.typography.body2,
  display: 'inline-block',
  width: '100%',
  textAlign: 'center',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  lineHeight: 1,

  '&:first-of-type': {
    marginTop: theme.spacing(1.5),
  },

  '&:last-child': {
    marginBottom: theme.spacing(1.5),
  },

  '&:hover': {
    textDecoration: 'underline',
  },

}));
export default AuthLinkStyled;
