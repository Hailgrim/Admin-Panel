import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useRouter } from 'next/router';
import React from 'react';

import lang from '../../../libs/lang';
import authApi from '../../../store/api/authApi';
import { setProfile } from '../../../store/slices/appSlice';
import { makeErrorText } from '../../../libs/functions';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import AuthLinkStyled from '../../../components/AuthLayout/AuthLinkStyled';
import TextFieldStyled from '../../../components/Other/TextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormCheckbox from '../../../components/Forms/FormCheckbox';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import { ROUTES } from '../../../libs/config';
import CustomModal from '../../Other/CustomModal';
import VerifyUser from './VerifyUser';

const Authorization: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const [signIn, { data, error, isFetching, originalArgs }] = authApi.useLazySignInQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [modalState, setModalState] = React.useState(false);

  const signInHandler = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    signIn({ username: email, password, rememberMe });
  };

  React.useEffect(() => {
    if (isFetching == true) {
      setErrorText(undefined);
      return;
    }

    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 410:
          setErrorText(String(lang.get(userLang)?.userDeleted));
          break;
        case 403:
          setModalState(true);
          break;
        case 401:
          setErrorText(String(lang.get(userLang)?.wrongEmailOrPassword));
          break;
        default:
          setErrorText(makeErrorText(error, userLang));
          break;
      }
    } else {
      if (data) {
        dispatch(setProfile(data));
        router.push(ROUTES.panel.home);
      }
    }
  }, [data, error, isFetching, dispatch, router, userLang]);

  return (
    <React.Fragment>
      <FormBoxStyled onSubmit={signInHandler}>
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
        <TextFieldStyled
          required
          type="password"
          name="password"
          label={lang.get(userLang)?.password}
          value={password}
          onChange={event => setPassword(event.currentTarget.value)}
        />
        <FormCheckbox
          label={lang.get(userLang)?.rememberMe}
          name="remember"
          value="remember"
          checked={rememberMe}
          onChange={event => setRememberMe(event.currentTarget.checked)}
        />
        <AuthButtonStyled disabled={isFetching || Boolean(data)}>
          {isFetching ? lang.get(userLang)?.loading : lang.get(userLang)?.signIn}
        </AuthButtonStyled>
        <AuthLinkStyled href={ROUTES.auth.signUp}>
          {lang.get(userLang)?.signUpText}
        </AuthLinkStyled>
        <AuthLinkStyled href={ROUTES.auth.forget}>
          {lang.get(userLang)?.forgotPasswordText}
        </AuthLinkStyled>
      </FormBoxStyled>
      <CustomModal
        open={modalState}
        onClose={() => setModalState(false)}
        title={lang.get(userLang)?.verification}
      >
        <VerifyUser
          email={originalArgs?.username || ''}
          callback={() => {
            setModalState(false);
            signInHandler();
          }}
        />
      </CustomModal>
    </React.Fragment>
  );
};
export default Authorization;
