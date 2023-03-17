import { Box, BoxProps, styled } from '@mui/material';

const FormBoxStyled = styled(
  (props: BoxProps<'form'>) => (
    <Box
      component="form"
      {...props}
    />
  ),
)(() => ({}));
export default FormBoxStyled;
