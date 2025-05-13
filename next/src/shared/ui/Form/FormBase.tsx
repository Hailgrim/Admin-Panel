import Box from '@mui/material/Box';
import { FC, FormHTMLAttributes, PropsWithChildren } from 'react';

const FormBase: FC<PropsWithChildren & FormHTMLAttributes<HTMLFormElement>> = ({
  children,
  ...props
}) => {
  return (
    <Box component="form" {...props}>
      {children}
    </Box>
  );
};
export default FormBase;
