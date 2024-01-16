import { Metadata } from 'next/types';
import { FC } from 'react';

import getT from '@/hooks/getT';
import AuthorizationPage from '@/components/Pages/Auth/AuthorizationPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.signIn,
    description: t.signIn,
  };
};

const Authorization: FC = async () => {
  const t = await getT();
  return <AuthorizationPage h1={t.signIn} />;
};
export default Authorization;
