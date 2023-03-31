import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useRouter } from 'next/router';

import lang from '../../../libs/lang';
import authApi from '../../../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { makeErrorText, testString } from '../../../libs/functions';
import TextFieldStyled from '../../../components/Other/TextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import { PASSWORD_REGEX } from '../../../libs/constants';
import { ROUTES } from '../../../libs/config';

const ResetPassword: React.FC<{
  email: string;
  callback?: () => void;
}> = ({ email, callback }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const [resetPassword, { data, error, isLoading }] = authApi.useLazyResetPasswordQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordError = React.useMemo(() => testString(PASSWORD_REGEX, password), [password]);

  const resetPasswordHandler = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    resetPassword({ email, code, password });
  };

  React.useEffect(() => {
    if (isLoading == true) {
      setErrorText(undefined);
      return;
    }

    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(String(lang.get(userLang)?.wrongEmail));
          break;
        default:
          setErrorText(makeErrorText(error, userLang));
          break;
      }
    } else {
      if (data) {
        if (callback) {
          callback();
        }
        router.push(ROUTES.auth.signIn);
      }
    }
  }, [
    data, error, isLoading,
    dispatch, userLang, router, callback,
  ]);

  return (
    <FormBoxStyled
      autoComplete="off"
      onSubmit={resetPasswordHandler}
    >
      {errorText && <AuthAlert severity="error" text={errorText} />}
      <TextFieldStyled
        required
        name="email"
        type="email"
        label={lang.get(userLang)?.email}
        value={email}
        disabled={true}
        autoFocus
      />
      <TextFieldStyled
        required
        autoComplete="off"
        type="text"
        name="code"
        label={lang.get(userLang)?.code}
        value={code}
        onChange={event => setCode(event.currentTarget.value)}
        helperText={lang.get(userLang)?.codeFromEmail}
      />
      <TextFieldStyled
        required
        autoComplete="new-password"
        type="password"
        name="newPassword"
        label={lang.get(userLang)?.newPassword}
        value={password}
        onChange={event => setPassword(event.currentTarget.value)}
        color={passwordError ? 'success' : undefined}
        helperText={lang.get(userLang)?.passwordValidation}
        focused={password.length > 0 || undefined}
      />
      <AuthButtonStyled
        disabled={isLoading || data || !passwordError || code.length == 0}
      >
        {isLoading ? lang.get(userLang)?.loading : lang.get(userLang)?.confirm}
      </AuthButtonStyled>
      <AuthButtonStyled color="error" type="button" onClick={callback}>
        {lang.get(userLang)?.close}
      </AuthButtonStyled>
    </FormBoxStyled>
  );
};
export default ResetPassword;
