'use client';

import { FC } from 'react';

import AuthPage from '@/components/Pages/AuthPage';
import ForgotForm from '@/components/Forms/Auth/ForgotForm';
import { IClientPage } from '@/lib/types';

const ForgotPasswordPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <ForgotForm />
    </AuthPage>
  );
};
export default ForgotPasswordPage;
