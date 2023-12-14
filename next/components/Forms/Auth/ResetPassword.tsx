import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useRouter } from 'next/router';

import authApi from '../../../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { makeErrorText, testString } from '../../../lib/functions';
import TextFieldStyled from '../FormTextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import { PASSWORD_REGEX } from '../../../lib/constants';
import { ROUTES } from '../../../lib/constants';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';

const ResetPassword: React.FC<{
  email: string;
  callback?: () => void;
}> = ({ email, callback }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useAppSelector(store => store.app.t);
  const [resetPassword, { data, error, isLoading }] = authApi.useLazyResetPasswordQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordError = React.useMemo(() => testString(PASSWORD_REGEX, password), [password]);

  const resetPasswordHandler = (event: React.FormEvent<HTMLFormElement>) => {
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
          setErrorText(String(dictionary[lang.current].wrongEmailOrCode));
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
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
  }, [data, error, isLoading, dispatch, router, callback, lang]);

  return (
    <FormBoxStyled
      autoComplete="off"
      onSubmit={resetPasswordHandler}
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
      <TextFieldStyled
        required
        autoComplete="new-password"
        type="password"
        name="newPassword"
        label={t.newPassword}
        value={password}
        onChange={event => setPassword(event.currentTarget.value)}
        color={passwordError ? 'success' : undefined}
        helperText={t.passwordValidation}
        focused={password.length > 0 || undefined}
      />
      <AuthButtonStyled
        disabled={isLoading || data || !passwordError || code.length == 0}
      >
        {isLoading ? t.loading : t.confirm}
      </AuthButtonStyled>
      <AuthButtonStyled color="error" type="button" onClick={callback}>
        {t.close}
      </AuthButtonStyled>
    </FormBoxStyled>
  );
};
export default ResetPassword;
