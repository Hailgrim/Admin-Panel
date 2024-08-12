'use client';

import { FC } from 'react';

import AuthLayout from '@/views/AuthLayout';
import SignUpForm from '@/features/Auth/SignUpForm';
import { IClientPage } from '../types';

const RegistrationPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <SignUpForm />
    </AuthLayout>
  );
};
export default RegistrationPage;
