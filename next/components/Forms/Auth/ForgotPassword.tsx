import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import lang from '../../../libs/lang';
import authApi from '../../../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { makeErrorText } from '../../../libs/functions';
import AuthLinkStyled from '../../../components/AuthLayout/AuthLinkStyled';
import TextFieldStyled from '../../../components/Other/TextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import { ROUTES } from '../../../libs/config';
import CustomModal from '../../Other/CustomModal';
import ResetPassword from './ResetPassword';

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const [forgotPassword, { data, error, isFetching, originalArgs }] = authApi.useLazyForgotPasswordQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [email, setEmail] = React.useState('');
  const [modalState, setModalState] = React.useState(false);

  const forgotPasswordHandler = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
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
          setErrorText(String(lang.get(userLang)?.wrongEmail));
          break;
        default:
          setErrorText(makeErrorText(error, userLang));
          break;
      }
    } else {
      if (data) {
        setModalState(true);
      }
    }
  }, [data, error, isFetching, dispatch, userLang]);

  return (
    <React.Fragment>
      <FormBoxStyled onSubmit={forgotPasswordHandler}>
        {errorText && <AuthAlert severity="error" text={errorText} />}
        <TextFieldStyled
          required
          name="email"
          type="email"
          label={lang.get(userLang)?.email}
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          autoFocus
        />
        <AuthButtonStyled disabled={isFetching}>
          {isFetching ? lang.get(userLang)?.loading : lang.get(userLang)?.confirm}
        </AuthButtonStyled>
        <AuthLinkStyled href={ROUTES.auth.signUp}>
          {lang.get(userLang)?.signUpText}
        </AuthLinkStyled>
        <AuthLinkStyled href={ROUTES.auth.signIn}>
          {lang.get(userLang)?.signInText}
        </AuthLinkStyled>
      </FormBoxStyled>
      <CustomModal
        open={modalState}
        onClose={() => setModalState(false)}
        title={lang.get(userLang)?.resetPassword}
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
