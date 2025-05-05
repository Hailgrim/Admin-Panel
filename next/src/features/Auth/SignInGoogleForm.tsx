import { FC, useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import Form from '@/shared/ui/Form/Form';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/ui/Form/FormAlert';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import { IWindowMessage } from './types';
import { ROUTES } from '@/shared/lib/constants';
import authApi from '@/shared/api/auth/authApi';
import { makeErrorText } from '@/shared/lib/utils';
import { IUser } from '@/shared/api/users/types';

const SignInGoogleForm: FC = () => {
  const t = useT();
  const lang = useLang();
  const hash = useRef(
    new URLSearchParams(
      typeof location === 'object' ? location.hash.slice(1) : ''
    )
  );
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signInGoogle, { data, error }] = authApi.useLazySignInGoogleQuery();

  useEffect(() => {
    if (hash.current.has('access_token')) {
      signInGoogle({ googleAccessToken: hash.current.get('access_token')! });
    } else {
      setErrorText(d[lang.current].error);
    }
  }, [signInGoogle, lang]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 410:
          setErrorText(d[lang.current].userDeleted);
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (!data) return;

    const messageHandler = (event: MessageEvent<string>) => {
      if (event.data === hash.current.get('state')) {
        const result: IWindowMessage<IUser> = {
          type: ROUTES.ui.signInGoogle,
          payload: data,
        };
        event.source?.postMessage(result);
        window.removeEventListener('message', messageHandler);
      }
      window.close();
    };

    window.addEventListener('message', messageHandler);
  }, [data]);

  return (
    <Form>
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
    </Form>
  );
};
export default SignInGoogleForm;
