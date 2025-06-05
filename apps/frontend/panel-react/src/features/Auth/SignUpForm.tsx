import { FC, useEffect, useMemo, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormPassword from '@/shared/ui/Form/FormPassword';
import FormButton from '@/shared/ui/Form/FormButton';
import FormLink from '@/shared/ui/Form/FormLink';
import FormAlert from '@/shared/ui/Form/FormAlert';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import SignUpSuccessForm from './SignUpSuccessForm';
import authApi from '@/shared/api/auth/authApi';
import {
  EMAIL_REGEX,
  getErrorText,
  NAME_REGEX,
  PASSWORD_REGEX,
  ROUTES,
  testString,
} from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const SignUpForm: FC = () => {
  const router = useRouter();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
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
          setErrorText(tRef.current.userAlreadyExist);
          break;
        default:
          setErrorText(getErrorText(error, lRef.current));
          break;
      }
    }
  }, [error, tRef, lRef]);

  useEffect(() => {
    if (data) {
      setSuccessModal(true);
    }
  }, [data]);

  return (
    <>
      <FormBase onSubmit={submitHandler}>
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
        <FormLink href={ROUTES.ui.forgotPassword} mui={{ align: 'center' }}>
          {t.forgotPasswordText}
        </FormLink>
      </FormBase>
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
