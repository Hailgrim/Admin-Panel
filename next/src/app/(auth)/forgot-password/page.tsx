import { Metadata } from 'next/types';
import { FC } from 'react';

import ForgotPasswordPage from '@/views/Auth/ForgotPasswordPage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.forgotPassword,
    description: t.forgotPassword,
  };
};

const ForgotPassword: FC = async () => {
  const t = getT();
  return <ForgotPasswordPage h1={t.forgotPassword} />;
};
export default ForgotPassword;
