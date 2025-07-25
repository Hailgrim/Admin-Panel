import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouter, useSearchParams } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import FormPassword from '@/shared/ui/Form/FormPassword';
import FormButton from '@/shared/ui/Form/FormButton';
import FormLink from '@/shared/ui/Form/FormLink';
import FormAlert from '@/shared/ui/Form/FormAlert';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import VerifyUserForm from './VerifyUserForm';
import { useAppDispatch } from '@/shared/store/hooks';
import authApi from '@/shared/api/auth/authApi';
import { setProfile } from '@/shared/store/main/main';
import SignInGoogleLink from './SignInGoogleLink';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useTranslate from '@/shared/hooks/useTranslate';
import { getErrorText, ROUTES } from '@ap/shared/src/libs';

const SignInForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signIn, { data, error, isFetching }] =
    authApi.useLazySignInQuery();
  const timeout = useRef<NodeJS.Timeout>(undefined);

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
          setErrorText(tRef.current.userDeleted);
          break;
        case 403:
          setVerifyModal(true);
          break;
        case 401:
          setErrorText(tRef.current.wrongEmailOrPassword);
          break;
        default:
          setErrorText(getErrorText(error, lRef.current));
          break;
      }
    }
  }, [error, tRef, lRef]);

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
      <FormBase onSubmit={submitHandler}>
        {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
        <FormField
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          disabled={isFetching || Boolean(data)}
        />
        <FormPassword
          required
          name="password"
          label={t.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isFetching || Boolean(data)}
        />
        <FormCheckbox
          labelProps={{ label: t.rememberMe }}
          name="remember"
          value="remember"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          disabled={isFetching || Boolean(data)}
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
        <FormLink href={ROUTES.ui.forgotPassword} mui={{ align: 'center' }}>
          {t.forgotPasswordText}
        </FormLink>
        <SignInGoogleLink />
      </FormBase>
      <CustomModal
        open={verifyModal}
        title={t.verification}
        onClose={() => setVerifyModal(false)}
      >
        <VerifyUserForm
          email={email}
          onClose={() => setVerifyModal(false)}
          onSuccess={() => (timeout.current = setTimeout(submitHandler, 1000))}
        />
      </CustomModal>
    </>
  );
};
export default SignInForm;
