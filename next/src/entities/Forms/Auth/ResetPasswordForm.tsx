import { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Form from '@/shared/kit/Form/Form';
import FormButton from '@/shared/kit/Form/FormButton';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/kit/Form/FormAlert';
import { PASSWORD_REGEX, ROUTES } from '@/shared/lib/constants';
import FormField from '@/shared/kit/Form/FormField';
import FormPassword from '@/shared/kit/Form/FormPassword';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import authApi from '@/shared/api/auth/authApi';
import { makeErrorText, testString } from '@/shared/lib/utils';

const ResetPasswordForm: FC<{
  email: string;
  callback?: () => void;
}> = ({ email, callback }) => {
  const router = useRouter();
  const t = useT();
  const lang = useLang();
  const [resetPassword, { data, error, isLoading }] =
    authApi.useLazyResetPasswordQuery();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, password),
    [password]
  );

  const formHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (email && code && passwordIsValid) {
      resetPassword({ email, code, password });
    }
  };

  useEffect(() => {
    if (isLoading === true) {
      setErrorText(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(d[lang.current].wrongEmailOrCode);
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (data) {
      callback?.();
      router.push(ROUTES.auth.signIn);
    }
  }, [data, callback, router]);

  return (
    <Form onSubmit={formHandler}>
      {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
      <FormField
        required
        autoComplete="off"
        type="text"
        name="code"
        label={t.code}
        value={code}
        onChange={(event) => setCode(event.currentTarget.value)}
        helperText={`${t.codeFromEmail} (${email})`}
      />
      <FormPassword
        required
        autoComplete="new-password"
        name="newPassword"
        label={t.newPassword}
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        helperText={t.passwordValidation}
        color={passwordIsValid ? 'success' : 'error'}
        error={!passwordIsValid && password.length > 0}
      />
      <FormButton type="submit" fullWidth loading={isLoading || data}>
        {t.confirm}
      </FormButton>
      <FormButton fullWidth color="error" onClick={callback}>
        {t.close}
      </FormButton>
    </Form>
  );
};
export default ResetPasswordForm;
