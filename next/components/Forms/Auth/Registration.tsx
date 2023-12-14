import { useRouter } from 'next/router';
import React from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import authApi from '../../../store/api/authApi';
import { makeErrorText, testString } from '../../../lib/functions';
import { useAppSelector } from '../../../store/hooks';
import AuthLinkStyled from '../../AuthLayout/AuthLinkStyled';
import TextFieldStyled from '../FormTextFieldStyled';
import AuthAlert from '../../AuthLayout/AuthAlert';
import AuthButtonStyled from '../../AuthLayout/AuthButtonStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../lib/constants';
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '../../../lib/constants';
import CustomModal from '../../Other/CustomModal';
import RegistrationSuccess from './RegistrationSuccess';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';

const Registration: React.FC = () => {
  const router = useRouter();
  const lang = useLang();
  const t = useAppSelector(store => store.app.t);
  const [signUp, { data, error, isLoading }] = authApi.useLazySignUpQuery();
  const [errorText, setErrorText] = React.useState<string>();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const nameError = React.useMemo(() => testString(NAME_REGEX, name), [name]);
  const emailError = React.useMemo(() => testString(EMAIL_REGEX, email), [email]);
  const passwordError = React.useMemo(() => testString(PASSWORD_REGEX, password), [password]);
  const [modalState, setModalState] = React.useState(false);

  const signUpHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signUp({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  React.useEffect(() => {
    if (isLoading == true) {
      setErrorText(undefined);
      return;
    }

    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 409:
          setErrorText(String(dictionary[lang.current].userAlreadyExist));
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
  }, [data, error, isLoading, router, lang]);

  return (
    <React.Fragment>
      <FormBoxStyled onSubmit={signUpHandler}>
        {errorText && <AuthAlert severity="error" text={errorText} />}
        <TextFieldStyled
          required
          name="name"
          type="text"
          label={t.name}
          value={name}
          onChange={event => setName(event.currentTarget.value)}
          color={nameError ? 'success' : undefined}
          helperText={t.nameValidation}
          focused={name.length > 0 || undefined}
          autoFocus
        />
        <TextFieldStyled
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          color={emailError ? 'success' : undefined}
          helperText={t.emailValidation}
          focused={email.length > 0 || undefined}
        />
        <TextFieldStyled
          required
          type="password"
          name="password"
          label={t.password}
          value={password}
          onChange={event => setPassword(event.currentTarget.value)}
          color={passwordError ? 'success' : undefined}
          helperText={t.passwordValidation}
          focused={password.length > 0 || undefined}
        />
        <AuthButtonStyled
          disabled={isLoading || Boolean(data) || !nameError || !emailError || !passwordError}
        >
          {isLoading ? t.loading : t.signUp}
        </AuthButtonStyled>
        <AuthLinkStyled href={ROUTES.auth.signIn}>
          {t.signInText}
        </AuthLinkStyled>
        <AuthLinkStyled href={ROUTES.auth.forget}>
          {t.forgotPasswordText}
        </AuthLinkStyled>
      </FormBoxStyled>
      <CustomModal
        open={modalState}
        onClose={() => setModalState(false)}
        title={t.registration}
      >
        <RegistrationSuccess callback={() => setModalState(false)} />
      </CustomModal>
    </React.Fragment>
  );
};
export default Registration;
