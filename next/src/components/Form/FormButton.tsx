import Button, { ButtonProps } from '@mui/material/Button';
import Link from 'next/link';
import { FC } from 'react';

const FormButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      variant="contained"
      sx={{ my: 1, mr: props.fullWidth ? 0 : 2 }}
      LinkComponent={Link}
      {...props}
    />
  );
};
export default FormButton;
