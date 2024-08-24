import { Metadata } from 'next/types';
import { FC } from 'react';

import { getT } from '@/shared/locales/utils';
import GoogleAuthorizationPage from '@/views/Auth/GoogleAuthorizationPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.signInWithGoogle,
    description: t.signInWithGoogle,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <GoogleAuthorizationPage h1={t.signInWithGoogle} />;
};
export default Page;
