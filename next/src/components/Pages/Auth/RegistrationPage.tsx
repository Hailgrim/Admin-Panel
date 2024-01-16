'use client';

import { FC } from 'react';

import AuthPage from '@/components/Pages/AuthPage';
import SignUpForm from '@/components/Forms/Auth/SignUpForm';
import { IClientPage } from '@/lib/types';

const RegistrationPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <SignUpForm />
    </AuthPage>
  );
};
export default RegistrationPage;
