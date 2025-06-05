'use client';

import { FC } from 'react';

import AuthLayout from '@/views/AuthLayout';
import SignInForm from '@/features/Auth/SignInForm';
import { IPage } from '../types';

const AuthorizationPage: FC<IPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <SignInForm />
    </AuthLayout>
  );
};
export default AuthorizationPage;
