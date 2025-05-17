import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import FormBase from '@/shared/ui/Form/FormBase';
import FormAlert from '@/shared/ui/Form/FormAlert';
import authApi from '@/shared/api/auth/authApi';
import { getErrorText, IUser, IWindowMessage, ROUTES } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const SignInGoogleForm: FC = () => {
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const hash = useRef(
    new URLSearchParams(
      typeof location === 'object' ? location.hash.slice(1) : ''
    )
  );
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signInGoogle, { data, error }] = authApi.useLazySignInGoogleQuery();

  const messageHandler = useCallback(
    (event: MessageEvent<IWindowMessage<string>>) => {
      if (event.data.type !== ROUTES.ui.signInGoogle || !data) return;

      if (event.data.payload === hash.current.get('state')) {
        const message: IWindowMessage<IUser> = {
          type: ROUTES.ui.signInGoogle,
          payload: data,
        };

        event.source?.postMessage(message);
      }

      window.close();
    },
    [data]
  );

  useEffect(() => {
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [messageHandler]);

  useEffect(() => {
    if (hash.current.has('access_token')) {
      signInGoogle({ googleAccessToken: hash.current.get('access_token')! });
    } else {
      setErrorText(tRef.current.error);
    }
  }, [signInGoogle, tRef]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 410:
          setErrorText(tRef.current.userDeleted);
          break;
        default:
          setErrorText(getErrorText(error, lRef.current));
          break;
      }
    }
  }, [error, tRef, lRef]);

  return (
    <FormBase>
      {errorText ? (
        <FormAlert severity="error">{errorText}</FormAlert>
      ) : (
        <Typography
          align="center"
          variant="subtitle1"
          sx={{ mt: 2, opacity: 0.75 }}
        >
          {t.loading}...
        </Typography>
      )}
    </FormBase>
  );
};
export default SignInGoogleForm;
