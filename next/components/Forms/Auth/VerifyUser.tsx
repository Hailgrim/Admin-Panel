import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import lang from '../../../lib/lang';
import authApi from '../../../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { makeErrorText } from '../../../lib/functions';
import TextFieldStyled from '../../../components/Other/TextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';

const VerifyUser: React.FC<{
  email: string;
  callback?: () => void;
}> = ({ email, callback }) => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
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
          setErrorText(String(lang.get(userLang)?.wrongCode));
          break;
        default:
          setErrorText(makeErrorText(error, userLang));
          break;
      }
    } else {
      if (data && callback) {
        callback();
      }
    }
  }, [
    data, error, isLoading,
    dispatch, userLang, callback,
  ]);

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
        label={lang.get(userLang)?.code}
        value={code}
        onChange={event => setCode(event.currentTarget.value)}
        helperText={`${lang.get(userLang)?.codeFromEmail} (${email})`}
      />
      <AuthButtonStyled
        disabled={isLoading || data || code.length == 0}
      >
        {isLoading ? lang.get(userLang)?.loading : lang.get(userLang)?.confirm}
      </AuthButtonStyled>
      <AuthButtonStyled color="error" type="button" onClick={callback}>
        {lang.get(userLang)?.close}
      </AuthButtonStyled>
    </FormBoxStyled>
  );
};
export default VerifyUser;
