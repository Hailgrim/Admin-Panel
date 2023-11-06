import { Alert, AlertColor, AlertTitle } from '@mui/material';
import React from 'react';

import lang from '../../lib/lang';
import { useAppSelector } from '../../store/hooks';

const AuthAlert: React.FC<{
  title?: string;
  text?: string;
  severity?: AlertColor;
}> = ({ title, text, severity }) => {
  const userLang = useAppSelector(store => store.app.userLang);
  const actualTitle = React.useMemo(() => {
    if (title) {
      return title;
    }
    switch (severity) {
      case 'error':
        return lang.get(userLang)?.error;
      case 'success':
        return lang.get(userLang)?.success;
      default:
        return lang.get(userLang)?.result;
    }
  }, [title, severity, userLang]);

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
