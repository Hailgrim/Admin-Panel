import { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Form from '@/components/Form/Form';
import FormButton from '@/components/Form/FormButton';
import useT from '@/hooks/useT';
import FormAlert from '@/components/Form/FormAlert';
import { PASSWORD_REGEX, ROUTES } from '@/lib/constants';
import authApi from '@/store/api/authApi';
import { makeErrorText, testString } from '@/lib/functions';
import FormField from '@/components/Form/FormField';
import FormPassword from '@/components/Form/FormPassword';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useLang from '@/hooks/useLang';
import d from '@/locales/dictionary';

const ResetForm: FC<{
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
          setErrorText(String(d[lang.current].wrongEmailOrCode));
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (data) {
      if (callback) {
        callback();
      }
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
      <FormButton type="submit" fullWidth disabled={isLoading}>
        {t.confirm}
      </FormButton>
      <FormButton fullWidth color="error" onClick={callback}>
        {t.close}
      </FormButton>
    </Form>
  );
};
export default ResetForm;
