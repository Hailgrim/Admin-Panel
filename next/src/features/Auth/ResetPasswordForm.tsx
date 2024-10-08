import { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Form from '@/shared/ui/Form/Form';
import FormButton from '@/shared/ui/Form/FormButton';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/ui/Form/FormAlert';
import { PASSWORD_REGEX, ROUTES } from '@/shared/lib/constants';
import FormField from '@/shared/ui/Form/FormField';
import FormPassword from '@/shared/ui/Form/FormPassword';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import authApi from '@/shared/api/auth/authApi';
import { makeErrorText, testString } from '@/shared/lib/utils';

const ResetPasswordForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
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

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email && code && passwordIsValid) {
      resetPassword({ email, code, password });
    }
  };

  useEffect(() => {
    if (isLoading) {
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
      onClose?.();
      router.push(ROUTES.ui.signIn);
    }
  }, [data, onClose, router]);

  return (
    <Form onSubmit={submitHandler}>
      {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
      <FormField
        required
        autoComplete="off"
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
      <FormButton fullWidth color="error" onClick={onClose}>
        {t.close}
      </FormButton>
    </Form>
  );
};
export default ResetPasswordForm;
