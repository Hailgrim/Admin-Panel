import { FC, FormEvent, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter, useSearchParams } from 'next/navigation';

import Form from '@/components/Form/Form';
import FormField from '@/components/Form/FormField';
import FormCheckbox from '@/components/Form/FormCheckbox';
import FormPassword from '@/components/Form/FormPassword';
import FormButton from '@/components/Form/FormButton';
import FormLink from '@/components/Form/FormLink';
import { ROUTES } from '@/lib/constants';
import useT from '@/hooks/useT';
import authApi from '@/store/api/authApi';
import FormAlert from '@/components/Form/FormAlert';
import { makeErrorText } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import { setProfile } from '@/store/slices/appSlice';
import { useAppDispatch } from '@/store/hooks';
import d from '@/locales/dictionary';
import CustomModal from '@/components/Other/CustomModal';
import VerifyForm from './VerifyForm';

const SignInForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useT();
  const lang = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signIn, { data, error, isFetching, originalArgs }] =
    authApi.useLazySignInQuery();

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && password) {
      signIn({ username: email, password, rememberMe });
    }
  };

  useEffect(() => {
    if (isFetching === true) {
      setErrorText(null);
    }
  }, [isFetching]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 410:
          setErrorText(String(d[lang.current].userDeleted));
          break;
        case 403:
          setModalState(true);
          break;
        case 401:
          setErrorText(String(d[lang.current].wrongEmailOrPassword));
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
        decodeURIComponent(searchParams.get('return') || ROUTES.panel.home)
      );
    }
  }, [data, dispatch, router, searchParams]);

  return (
    <>
      <Form onSubmit={formHandler}>
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
          disabled={Boolean(isFetching || data)}
        >
          {t.signIn}
        </FormButton>
        <FormLink href={ROUTES.auth.signUp} mui={{ align: 'center' }}>
          {t.signUpText}
        </FormLink>
        <FormLink href={ROUTES.auth.forget} mui={{ align: 'center' }}>
          {t.forgotPasswordText}
        </FormLink>
      </Form>
      <CustomModal
        open={modalState}
        title={t.verification}
        onClose={() => setModalState(false)}
      >
        <VerifyForm
          email={originalArgs?.username || ''}
          callback={() => setModalState(false)}
        />
      </CustomModal>
    </>
  );
};
export default SignInForm;
