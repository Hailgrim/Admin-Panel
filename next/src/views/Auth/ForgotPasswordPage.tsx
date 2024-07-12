'use client';

import { FC } from 'react';

import AuthPage from '@/views/AuthPage';
import ForgotForm from '@/entities/Forms/Auth/ForgotForm';
import { IClientPage } from '../types';

const ForgotPasswordPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <ForgotForm />
    </AuthPage>
  );
};
export default ForgotPasswordPage;
