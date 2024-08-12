'use client';

import { FC } from 'react';

import AuthLayout from '@/views/AuthLayout';
import ForgotPasswordForm from '@/features/Auth/ForgotPasswordForm';
import { IClientPage } from '../types';

const ForgotPasswordPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
export default ForgotPasswordPage;
