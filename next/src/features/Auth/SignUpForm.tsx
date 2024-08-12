import { FC, useEffect, useMemo, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/navigation';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormPassword from '@/shared/ui/Form/FormPassword';
import FormButton from '@/shared/ui/Form/FormButton';
import FormLink from '@/shared/ui/Form/FormLink';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  ROUTES,
} from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/ui/Form/FormAlert';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import SignUpSuccessForm from './SignUpSuccessForm';
import { makeErrorText, testString } from '@/shared/lib/utils';
import authApi from '@/shared/api/auth/authApi';

const SignUpForm: FC = () => {
  const router = useRouter();
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
  const [successModal, setSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signUp, { data, error, isLoading }] = authApi.useLazySignUpQuery();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nameIsValid && emailIsValid && passwordIsValid) {
      signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    }
  };

  const successHandler = () => {
    setSuccessModal(false);
    router.push(ROUTES.ui.signIn);
  };

  useEffect(() => {
    if (isLoading) {
      setErrorText(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 409:
          setErrorText(d[lang.current].userAlreadyExist);
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (data) {
      setSuccessModal(true);
    }
  }, [data]);

  return (
    <>
      <Form onSubmit={submitHandler}>
        {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
        <FormField
          required
          name="name"
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
        <FormButton type="submit" fullWidth loading={isLoading}>
          {t.signUp}
        </FormButton>
        <FormLink href={ROUTES.ui.signIn} mui={{ align: 'center' }}>
          {t.signInText}
        </FormLink>
        <FormLink href={ROUTES.ui.forget} mui={{ align: 'center' }}>
          {t.forgotPasswordText}
        </FormLink>
      </Form>
      <CustomModal
        open={successModal}
        title={t.registration}
        onClose={() => setSuccessModal(false)}
      >
        <SignUpSuccessForm onClose={successHandler} />
      </CustomModal>
    </>
  );
};
export default SignUpForm;
