import { FC, FormEvent, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import FormAlert from '@/shared/ui/Form/FormAlert';
import authApi from '@/shared/api/auth/authApi';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import { getErrorText } from '@ap/shared/src/libs';

const VerifyUserForm: FC<{
  email: string;
  onClose?: () => void;
  onSuccess?: () => void;
}> = ({ email, onClose, onSuccess }) => {
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [verifyUser, { isSuccess, error, isFetching }] =
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
    if (isSuccess) {
      onClose?.();
      onSuccess?.();
    }
  }, [isSuccess, onClose, onSuccess]);

  return (
    <FormBase onSubmit={submitHandler}>
      {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
      <FormField
        required
        autoComplete="off"
        name="code"
        label={t.code}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        helperText={`${t.codeFromEmail} (${email})`}
      />
      <FormButton type="submit" fullWidth loading={isFetching || isSuccess}>
        {t.confirm}
      </FormButton>
      <FormButton color="error" onClick={onClose} fullWidth>
        {t.close}
      </FormButton>
    </FormBase>
  );
};
export default VerifyUserForm;
