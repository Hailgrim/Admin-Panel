import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useRouter } from 'next/router';
import React from 'react';

import authApi from '../../../store/api/authApi';
import { setProfile } from '../../../store/slices/appSlice';
import { makeErrorText } from '../../../lib/functions';
import { useAppDispatch } from '../../../store/hooks';
import AuthLinkStyled from '../../../components/AuthLayout/AuthLinkStyled';
import TextFieldStyled from '../FormTextFieldStyled';
import AuthAlert from '../../../components/AuthLayout/AuthAlert';
import FormCheckbox from '../../../components/Forms/FormCheckbox';
import FormBoxStyled from '../../../components/Forms/FormBoxStyled';
import AuthButtonStyled from '../../../components/AuthLayout/AuthButtonStyled';
import CustomModal from '../../Other/CustomModal';
import VerifyUser from './VerifyUser';
import { ROUTES } from '../../../lib/constants';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';
import useT from 'hooks/useT';

const Authorization: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [signIn, { data, error, isFetching, originalArgs }] =
    authApi.useLazySignInQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [modalState, setModalState] = React.useState(false);

  const signInHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          setErrorText(String(dictionary[lang.current].userDeleted));
          break;
        case 403:
          setModalState(true);
          break;
        case 401:
          setErrorText(String(dictionary[lang.current].wrongEmailOrPassword));
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    } else {
      if (data) {
        dispatch(setProfile(data));
        router.push(
          router.query.return
            ? decodeURIComponent(String(router.query.return))
            : ROUTES.panel.home
        );
      }
    }
  }, [data, error, isFetching, dispatch, router, lang]);

  return (
    <React.Fragment>
      <FormBoxStyled onSubmit={signInHandler}>
        {errorText && <AuthAlert severity="error" text={errorText} />}
        <TextFieldStyled
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          autoFocus
        />
        <TextFieldStyled
          required
          type="password"
          name="password"
          label={t.password}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <FormCheckbox
          label={t.rememberMe}
          name="remember"
          value="remember"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        <AuthButtonStyled disabled={isFetching || Boolean(data)}>
          {isFetching ? t.loading : t.signIn}
        </AuthButtonStyled>
        <AuthLinkStyled href={ROUTES.auth.signUp}>
          {t.signUpText}
        </AuthLinkStyled>
        <AuthLinkStyled href={ROUTES.auth.forget}>
          {t.forgotPasswordText}
        </AuthLinkStyled>
      </FormBoxStyled>
      <CustomModal
        open={modalState}
        onClose={() => setModalState(false)}
        title={t.verification}
      >
        <VerifyUser
          email={originalArgs?.username || ''}
          callback={() => setModalState(false)}
        />
      </CustomModal>
    </React.Fragment>
  );
};
export default Authorization;
