import { styled } from '@mui/material';
import Link from 'next/link';

const LinkStyled = styled(Link)(() => ({
  display: 'inline-block',
  margin: 'unset',
  padding: 'unset',
  textDecoration: 'none',
  color: 'inherit',
}));
export default LinkStyled;
