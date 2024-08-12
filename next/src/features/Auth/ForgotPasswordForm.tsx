import { FC, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import FormLink from '@/shared/ui/Form/FormLink';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/ui/Form/FormAlert';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import ResetPasswordForm from './ResetPasswordForm';
import authApi from '@/shared/api/auth/authApi';
import { makeErrorText } from '@/shared/lib/utils';

const ForgotPasswordForm: FC = () => {
  const t = useT();
  const lang = useLang();
  const [email, setEmail] = useState('');
  const [resetModal, setResetModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [forgotPassword, { data, error, isFetching, originalArgs }] =
    authApi.useLazyForgotPasswordQuery();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email) {
      forgotPassword(email);
    }
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
      setResetModal(true);
    }
  }, [data]);

  return (
    <>
      <Form onSubmit={submitHandler}>
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
        <FormButton type="submit" fullWidth loading={isFetching}>
          {t.confirm}
        </FormButton>
        <FormLink href={ROUTES.ui.signIn} mui={{ align: 'center' }}>
          {t.signInText}
        </FormLink>
        <FormLink href={ROUTES.ui.signUp} mui={{ align: 'center' }}>
          {t.signUpText}
        </FormLink>
      </Form>
      <CustomModal
        open={resetModal}
        title={t.resetPassword}
        onClose={() => setResetModal(false)}
      >
        <ResetPasswordForm
          email={originalArgs || ''}
          onClose={() => setResetModal(false)}
        />
      </CustomModal>
    </>
  );
};
export default ForgotPasswordForm;
