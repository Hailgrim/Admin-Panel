import { FC } from 'react';
import { Metadata } from 'next/types';

import usersService from '@/shared/api/users/usersService';
import UsersPage from '@/views/Panel/Users/UsersPage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.users,
    description: t.users,
  };
};

const Users: FC = async () => {
  const t = getT();
  const { data } = await usersService.findAndCountAll();
  return <UsersPage h1={t.users} data={data} />;
};
export default Users;
