import { Metadata } from 'next/types';
import { FC } from 'react';

import GoogleAuthorizationPage from '@/views/Auth/GoogleAuthorizationPage';
import { getT } from '@ap/shared';

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
