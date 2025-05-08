import { FC, FormEvent, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import FormAlert from '@/shared/ui/Form/FormAlert';
import authApi from '@/shared/api/auth/authApi';
import { getErrorText } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const VerifyUserForm: FC<{
  email: string;
  onClose?: () => void;
  onSuccess?: () => void;
}> = ({ email, onClose, onSuccess }) => {
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [verifyUser, { data, error, isFetching }] =
    authApi.useLazyVerifyUserQuery();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyUser({ email, code });
  };

  useEffect(() => {
    if (isFetching) {
      setErrorText(null);
    }
  }, [isFetching]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(tRef.current.wrongCode);
          break;
        default:
          setErrorText(getErrorText(error, lRef.current));
          break;
      }
    }
  }, [error, lRef, tRef]);

  useEffect(() => {
    if (data) {
      onClose?.();
      onSuccess?.();
    }
  }, [data, onClose, onSuccess]);

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
      <FormButton type="submit" fullWidth loading={isFetching || data}>
        {t.confirm}
      </FormButton>
      <FormButton color="error" onClick={onClose} fullWidth>
        {t.close}
      </FormButton>
    </Form>
  );
};
export default VerifyUserForm;
