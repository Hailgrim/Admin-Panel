import { FC, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import FormLink from '@/shared/ui/Form/FormLink';
import FormAlert from '@/shared/ui/Form/FormAlert';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import ResetPasswordForm from './ResetPasswordForm';
import authApi from '@/shared/api/auth/authApi';
import { getErrorText, ROUTES } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const ForgotPasswordForm: FC = () => {
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [email, setEmail] = useState('');
  const [resetModal, setResetModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [forgotPassword, { data, error, isFetching, originalArgs }] =
    authApi.useLazyForgotPasswordQuery();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email) {
      forgotPassword({ email });
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
          setErrorText(tRef.current.wrongEmail);
          break;
        default:
          setErrorText(getErrorText(error, lRef.current));
          break;
      }
    }
  }, [error, tRef, lRef]);

  useEffect(() => {
    if (data) {
      setResetModal(true);
    }
  }, [data]);

  return (
    <>
      <FormBase onSubmit={submitHandler}>
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
      </FormBase>
      <CustomModal
        open={resetModal}
        title={t.resetPassword}
        onClose={() => setResetModal(false)}
      >
        <ResetPasswordForm
          email={originalArgs?.email || ''}
          onClose={() => setResetModal(false)}
        />
      </CustomModal>
    </>
  );
};
export default ForgotPasswordForm;
