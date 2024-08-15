import { FC } from 'react';
import { Metadata } from 'next/types';

import NewUserPage from '@/views/Panel/Users/NewUserPage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.newUser,
    description: t.newUser,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <NewUserPage h1={t.newUser} />;
};
export default Page;
