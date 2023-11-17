import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import authApi from '../../../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { makeErrorText } from '../../../lib/functions';
import AuthLinkStyled from '../../../components/AuthLayout/AuthLinkStyled';
import TextFieldStyled from '../../../components/Other/TextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import { ROUTES } from '../../../lib/constants';
import CustomModal from '../../Other/CustomModal';
import ResetPassword from './ResetPassword';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useAppSelector(store => store.app.t);
  const [forgotPassword, { data, error, isFetching, originalArgs }] = authApi.useLazyForgotPasswordQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [email, setEmail] = React.useState('');
  const [modalState, setModalState] = React.useState(false);

  const forgotPasswordHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    forgotPassword(email);
  };

  React.useEffect(() => {
    if (isFetching == true) {
      setErrorText(undefined);
      return;
    }

    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(String(dictionary[lang.current].wrongEmail));
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    } else {
      if (data) {
        setModalState(true);
      }
    }
  }, [data, error, isFetching, dispatch]);

  return (
    <React.Fragment>
      <FormBoxStyled onSubmit={forgotPasswordHandler}>
        {errorText && <AuthAlert severity="error" text={errorText} />}
        <TextFieldStyled
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          autoFocus
        />
        <AuthButtonStyled disabled={isFetching}>
          {isFetching ? t.loading : t.confirm}
        </AuthButtonStyled>
        <AuthLinkStyled href={ROUTES.auth.signUp}>
          {t.signUpText}
        </AuthLinkStyled>
        <AuthLinkStyled href={ROUTES.auth.signIn}>
          {t.signInText}
        </AuthLinkStyled>
      </FormBoxStyled>
      <CustomModal
        open={modalState}
        onClose={() => setModalState(false)}
        title={t.resetPassword}
      >
        <ResetPassword
          email={originalArgs || ''}
          callback={() => setModalState(false)}
        />
      </CustomModal>
    </React.Fragment>
  );
};
export default ForgotPassword;
