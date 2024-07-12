import { FC, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import Form from '@/kit/Form/Form';
import FormField from '@/kit/Form/FormField';
import FormButton from '@/kit/Form/FormButton';
import FormLink from '@/kit/Form/FormLink';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/kit/Form/FormAlert';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import CustomModal from '@/kit/CustomModal/CustomModal';
import ResetForm from './ResetForm';
import authApi from '@/shared/api/auth/authApi';
import { makeErrorText } from '@/shared/lib/utils';

const ForgotForm: FC = () => {
  const t = useT();
  const lang = useLang();
  const [email, setEmail] = useState('');
  const [modalState, setModalState] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [forgotPassword, { data, error, isFetching, originalArgs }] =
    authApi.useLazyForgotPasswordQuery();

  const formHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email) {
      forgotPassword(email);
    }
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
          setErrorText(d[lang.current].wrongEmail);
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (data) {
      setModalState(true);
    }
  }, [data]);

  return (
    <>
      <Form onSubmit={formHandler}>
        {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
        <FormField
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          autoFocus
        />
        <FormButton type="submit" fullWidth disabled={isFetching}>
          {t.confirm}
        </FormButton>
        <FormLink href={ROUTES.auth.signIn} mui={{ align: 'center' }}>
          {t.signInText}
        </FormLink>
        <FormLink href={ROUTES.auth.signUp} mui={{ align: 'center' }}>
          {t.signUpText}
        </FormLink>
      </Form>
      <CustomModal
        open={modalState}
        title={t.resetPassword}
        onClose={() => setModalState(false)}
      >
        <ResetForm
          email={originalArgs || ''}
          callback={() => setModalState(false)}
        />
      </CustomModal>
    </>
  );
};
export default ForgotForm;
