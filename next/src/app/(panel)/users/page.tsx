import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import usersService from '@/services/usersService';
import UsersPage from '@/components/Pages/Panel/Users/UsersPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.users,
    description: t.users,
  };
};

const Users: FC = async () => {
  const t = await getT();
  const { data } = await usersService.findAndCountAll();
  return <UsersPage h1={t.users} data={data} />;
};
export default Users;
