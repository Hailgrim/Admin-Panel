import { Alert, AlertColor, AlertTitle } from '@mui/material';
import React from 'react';

import { useAppSelector } from '../../store/hooks';

const AuthAlert: React.FC<{
  title?: string;
  text?: string;
  severity?: AlertColor;
}> = ({ title, text, severity }) => {
  const t = useAppSelector(store => store.app.t);
  const actualTitle = React.useMemo(() => {
    if (title) {
      return title;
    }
    switch (severity) {
      case 'error':
        return t.error;
      case 'success':
        return t.success;
      default:
        return t.result;
    }
  }, [title, severity, t]);

  return (
    <Alert
      variant="filled"
      severity={severity}
      sx={{ my: 1.5 }}
    >
      {actualTitle && <AlertTitle>{actualTitle}</AlertTitle>}
      {text}
    </Alert>
  );
};
export default AuthAlert;
