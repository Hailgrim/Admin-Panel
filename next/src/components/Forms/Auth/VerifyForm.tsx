import { FC, FormEvent, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import Form from '@/components/Form/Form';
import FormField from '@/components/Form/FormField';
import FormButton from '@/components/Form/FormButton';
import useT from '@/hooks/useT';
import authApi from '@/store/api/authApi';
import FormAlert from '@/components/Form/FormAlert';
import { makeErrorText } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import d from '@/locales/dictionary';

const VerifyUser: FC<{
  email: string;
  callback?: () => void;
}> = ({ email, callback }) => {
  const t = useT();
  const lang = useLang();
  const [verifyUser, { data, error, isFetching }] =
    authApi.useLazyVerifyUserQuery();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const verifyHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyUser({ email, code });
  };

  useEffect(() => {
    if (isFetching === true) {
      setErrorText(null);
    }
  }, [isFetching]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(String(d[lang.current].wrongCode));
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (data && callback) {
      callback();
    }
  }, [data, callback]);

  return (
    <Form onSubmit={verifyHandler}>
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
      <FormButton type="submit" fullWidth disabled={isFetching || data}>
        {t.confirm}
      </FormButton>
      <FormButton color="error" onClick={callback} fullWidth>
        {t.close}
      </FormButton>
    </Form>
  );
};
export default VerifyUser;
