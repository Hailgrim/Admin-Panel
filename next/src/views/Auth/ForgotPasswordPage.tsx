'use client';

import { FC } from 'react';

import AuthLayout from '@/views/AuthLayout';
import ForgotPasswordForm from '@/features/Auth/ForgotPasswordForm';
import { IPage } from '../types';

const ForgotPasswordPage: FC<IPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
export default ForgotPasswordPage;
