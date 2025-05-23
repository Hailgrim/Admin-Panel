import useTranslate from '@/shared/hooks/useTranslate';
import Button, { ButtonProps } from '@mui/material/Button';
import Link from 'next/link';
import { FC } from 'react';

const FormButton: FC<ButtonProps & { loading?: boolean }> = ({
  loading,
  ...props
}) => {
  const t = useTranslate();

  return (
    <Button
      variant="contained"
      sx={{ my: 1, mr: props.fullWidth ? 0 : 2 }}
      LinkComponent={Link}
      {...props}
      disabled={props.disabled || loading}
    >
      {loading ? t.loading : props.children}
    </Button>
  );
};
export default FormButton;
