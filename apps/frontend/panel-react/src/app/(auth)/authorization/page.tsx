import { Metadata } from 'next/types';
import { FC } from 'react';

import AuthorizationPage from '@/views/Auth/AuthorizationPage';
import { getT } from '@ap/shared';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.signIn,
    description: t.signIn,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <AuthorizationPage h1={t.signIn} />;
};
export default Page;
