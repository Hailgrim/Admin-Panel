import { styled, TextField, TextFieldProps } from '@mui/material';

import theme from '../../libs/theme';

const TextFieldStyled = styled(
  (props: TextFieldProps) => (
    <TextField
      fullWidth
      size="medium"
      margin="dense"
      {...props}
    />
  ),
)(() => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));
export default TextFieldStyled;
