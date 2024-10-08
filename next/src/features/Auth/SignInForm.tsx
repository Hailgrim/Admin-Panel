import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter, useSearchParams } from 'next/navigation';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import FormPassword from '@/shared/ui/Form/FormPassword';
import FormButton from '@/shared/ui/Form/FormButton';
import FormLink from '@/shared/ui/Form/FormLink';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/ui/Form/FormAlert';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import VerifyUserForm from './VerifyUserForm';
import { useAppDispatch } from '@/shared/store/hooks';
import authApi from '@/shared/api/auth/authApi';
import { makeErrorText } from '@/shared/lib/utils';
import { setProfile } from '@/shared/store/main/main';
import SignInGoogleLink from './SignInGoogleLink';

const SignInForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useT();
  const lang = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signIn, { data, error, isFetching, originalArgs }] =
    authApi.useLazySignInQuery();
  const timeout = useRef<NodeJS.Timeout>();

  const submitHandler = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (email && password) {
      signIn({ username: email, password, rememberMe });
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
        case 410:
          setErrorText(d[lang.current].userDeleted);
          break;
        case 403:
          setVerifyModal(true);
          break;
        case 401:
          setErrorText(d[lang.current].wrongEmailOrPassword);
          break;
        default:
          setErrorText(makeErrorText(error, lang.current));
          break;
      }
    }
  }, [error, lang]);

  useEffect(() => {
    if (data) {
      dispatch(setProfile(data));
      router.push(
        decodeURIComponent(searchParams.get('return') || ROUTES.ui.home)
      );
    }
  }, [data, dispatch, router, searchParams]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

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
        <FormPassword
          required
          name="password"
          label={t.password}
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <FormCheckbox
          labelProps={{ label: t.rememberMe }}
          name="remember"
          value="remember"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        <FormButton
          type="submit"
          fullWidth
          loading={isFetching || Boolean(data)}
        >
          {t.signIn}
        </FormButton>
        <FormLink href={ROUTES.ui.signUp} mui={{ align: 'center' }}>
          {t.signUpText}
        </FormLink>
        <FormLink href={ROUTES.ui.forget} mui={{ align: 'center' }}>
          {t.forgotPasswordText}
        </FormLink>
        <SignInGoogleLink />
      </Form>
      <CustomModal
        open={verifyModal}
        title={t.verification}
        onClose={() => setVerifyModal(false)}
      >
        <VerifyUserForm
          email={originalArgs?.username || ''}
          onClose={() => setVerifyModal(false)}
          onSuccess={() => (timeout.current = setTimeout(submitHandler, 1000))}
        />
      </CustomModal>
    </>
  );
};
export default SignInForm;
