'use client';

import { FC } from 'react';

import AuthLayout from '@/views/AuthLayout';
import { IPage } from '../types';
import SignInGoogleForm from '@/features/Auth/SignInGoogleForm';

const GoogleAuthorizationPage: FC<IPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <SignInGoogleForm />
    </AuthLayout>
  );
};
export default GoogleAuthorizationPage;
