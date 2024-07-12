'use client';

import { FC } from 'react';

import AuthPage from '@/views/AuthPage';
import SignInForm from '@/entities/Forms/Auth/SignInForm';
import { IClientPage } from '../types';

const AuthorizationPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <SignInForm />
    </AuthPage>
  );
};
export default AuthorizationPage;
