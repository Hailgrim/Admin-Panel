import { Button, ButtonProps, styled } from '@mui/material';

import theme from '../../lib/theme';

const AuthButtonStyled = styled(
  (props: ButtonProps) => (
    <Button
      fullWidth
      type="submit"
      variant="contained"
      {...props}
    />
  ),
)(() => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));
export default AuthButtonStyled;
