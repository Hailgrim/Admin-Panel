import { Metadata } from 'next/types';
import { FC } from 'react';

import getT from '@/hooks/getT';
import ForgotPasswordPage from '@/components/Pages/Auth/ForgotPasswordPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.forgotPassword,
    description: t.forgotPassword,
  };
};

const ForgotPassword: FC = async () => {
  const t = await getT();
  return <ForgotPasswordPage h1={t.forgotPassword} />;
};
export default ForgotPassword;
