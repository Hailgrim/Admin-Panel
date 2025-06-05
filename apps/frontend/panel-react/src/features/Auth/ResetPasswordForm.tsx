import { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormButton from '@/shared/ui/Form/FormButton';
import FormAlert from '@/shared/ui/Form/FormAlert';
import FormField from '@/shared/ui/Form/FormField';
import FormPassword from '@/shared/ui/Form/FormPassword';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import authApi from '@/shared/api/auth/authApi';
import { getErrorText, PASSWORD_REGEX, ROUTES, testString } from '@ap/shared';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslate from '@/shared/hooks/useTranslate';

const ResetPasswordForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
  const router = useRouter();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [resetPassword, { isSuccess, error, isLoading }] =
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
          setErrorText(tRef.current.wrongEmailOrCode);
          break;
        default:
          setErrorText(getErrorText(error, lRef.current));
          break;
      }
    }
  }, [error, tRef, lRef]);

  useEffect(() => {
    if (isSuccess) {
      onClose?.();
      router.push(ROUTES.ui.signIn);
    }
  }, [isSuccess, onClose, router]);

  return (
    <FormBase onSubmit={submitHandler}>
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
      <FormButton type="submit" fullWidth loading={isLoading || isSuccess}>
        {t.confirm}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t.close}
      </FormButton>
    </FormBase>
  );
};
export default ResetPasswordForm;
