'use client';

import { FC } from 'react';

import AuthPage from '@/views/AuthPage';
import SignUpForm from '@/entities/Forms/Auth/SignUpForm';
import { IClientPage } from '../types';

const RegistrationPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <AuthPage h1={h1}>
      <SignUpForm />
    </AuthPage>
  );
};
export default RegistrationPage;
