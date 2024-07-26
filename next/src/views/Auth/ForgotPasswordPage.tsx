'use client';

import { FC } from 'react';

import AuthPage from '@/views/AuthPage';
import ForgotPasswordForm from '@/entities/Forms/Auth/ForgotPasswordForm';
import { IClientPage } from '../types';

const ForgotPasswordPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <ForgotPasswordForm />
    </AuthPage>
  );
};
export default ForgotPasswordPage;
