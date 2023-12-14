import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import authApi from '../../../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { makeErrorText } from '../../../lib/functions';
import TextFieldStyled from '../FormTextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';

const VerifyUser: React.FC<{
  email: string;
  callback?: () => void;
}> = ({ email, callback }) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useAppSelector(store => store.app.t);
  const [verifyUser, { data, error, isLoading }] = authApi.useLazyVerifyUserQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [code, setCode] = React.useState('');

  const verifyUserHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyUser({ email, code });
  };

  React.useEffect(() => {
    if (isLoading == true) {
      setErrorText(undefined);
      return;
    }

    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(String(dictionary[lang.current].wrongCode));
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    } else {
      if (data && callback) {
        callback();
      }
    }
  }, [data, error, isLoading, dispatch, callback, lang]);

  return (
    <FormBoxStyled
      autoComplete="off"
      onSubmit={verifyUserHandler}
    >
      {errorText && <AuthAlert severity="error" text={errorText} />}
      <TextFieldStyled
        required
        autoComplete="off"
        type="text"
        name="code"
        label={t.code}
        value={code}
        onChange={event => setCode(event.currentTarget.value)}
        helperText={`${t.codeFromEmail} (${email})`}
      />
      <AuthButtonStyled
        disabled={isLoading || data || code.length == 0}
      >
        {isLoading ? t.loading : t.confirm}
      </AuthButtonStyled>
      <AuthButtonStyled color="error" type="button" onClick={callback}>
        {t.close}
      </AuthButtonStyled>
    </FormBoxStyled>
  );
};
export default VerifyUser;
