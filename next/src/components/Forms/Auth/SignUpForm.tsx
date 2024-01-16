import { FC, useEffect, useMemo, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import Form from '@/components/Form/Form';
import FormField from '@/components/Form/FormField';
import FormPassword from '@/components/Form/FormPassword';
import FormButton from '@/components/Form/FormButton';
import FormLink from '@/components/Form/FormLink';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  ROUTES,
} from '@/lib/constants';
import useT from '@/hooks/useT';
import authApi from '@/store/api/authApi';
import FormAlert from '@/components/Form/FormAlert';
import { makeErrorText, testString } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import d from '@/locales/dictionary';
import CustomModal from '@/components/Other/CustomModal';
import SignUpSuccess from './SignUpSuccess';

const SignUpForm: FC = () => {
  const t = useT();
  const lang = useLang();
  const [name, setName] = useState('');
  const nameIsValid = useMemo(() => testString(NAME_REGEX, name), [name]);
  const [email, setEmail] = useState('');
  const emailIsValid = useMemo(() => testString(EMAIL_REGEX, email), [email]);
  const [password, setPassword] = useState('');
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, password),
    [password]
  );
  const [modalState, setModalState] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signUp, { data, error, isLoading }] = authApi.useLazySignUpQuery();

  const formHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameIsValid && emailIsValid && passwordIsValid) {
      signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    }
  };

  useEffect(() => {
    if (isLoading === true) {
      setErrorText(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 409:
          setErrorText(String(d[lang.current].userAlreadyExist));
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
          name="name"
          type="text"
          label={t.name}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          helperText={t.nameValidation}
          color={nameIsValid ? 'success' : 'error'}
          error={!nameIsValid && name.length > 0}
          autoFocus
        />
        <FormField
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          helperText={t.emailValidation}
          color={emailIsValid ? 'success' : 'error'}
          error={!emailIsValid && email.length > 0}
        />
        <FormPassword
          required
          name="password"
          label={t.password}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          helperText={t.passwordValidation}
          color={passwordIsValid ? 'success' : 'error'}
          error={!passwordIsValid && password.length > 0}
        />
        <FormButton type="submit" fullWidth disabled={isLoading}>
          {t.signUp}
        </FormButton>
        <FormLink href={ROUTES.auth.signIn} mui={{ align: 'center' }}>
          {t.signInText}
        </FormLink>
        <FormLink href={ROUTES.auth.forget} mui={{ align: 'center' }}>
          {t.forgotPasswordText}
        </FormLink>
      </Form>
      <CustomModal
        open={modalState}
        title={t.registration}
        onClose={() => setModalState(false)}
      >
        <SignUpSuccess callback={() => setModalState(false)} />
      </CustomModal>
    </>
  );
};
export default SignUpForm;
