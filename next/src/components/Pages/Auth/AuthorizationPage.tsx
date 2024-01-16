'use client';

import { FC } from 'react';

import AuthPage from '@/components/Pages/AuthPage';
import SignInForm from '@/components/Forms/Auth/SignInForm';
import { IClientPage } from '@/lib/types';

const AuthorizationPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <SignInForm />
    </AuthPage>
  );
};
export default AuthorizationPage;
