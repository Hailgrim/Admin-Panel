import { Metadata } from 'next/types';
import { FC } from 'react';

import getT from '@/hooks/getT';
import RegistrationPage from '@/components/Pages/Auth/RegistrationPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.signUp,
    description: t.signUp,
  };
};

const Registration: FC = async () => {
  const t = await getT();
  return <RegistrationPage h1={t.signUp} />;
};
export default Registration;
