import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import NewUserPage from '@/components/Pages/Panel/Users/NewUserPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.newUser,
    description: t.newUser,
  };
};

const NewUser: FC = async () => {
  const t = await getT();
  return <NewUserPage h1={t.newUser} />;
};
export default NewUser;
