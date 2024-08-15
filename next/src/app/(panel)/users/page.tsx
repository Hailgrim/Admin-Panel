import { FC } from 'react';
import { Metadata } from 'next/types';

import usersService from '@/shared/api/users/usersService';
import UsersPage from '@/views/Panel/Users/UsersPage';
import { getT } from '@/shared/locales/utils';
import { IAppPage } from '@/app/types';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.users,
    description: t.users,
  };
};

const Page: FC<IAppPage> = async (props) => {
  const t = getT();
  const page = Number(props.searchParams.page) || 1;
  const quantity = Number(props.searchParams.quantity) || 25;
  const { data } = await usersService.findAndCountAll({ page, quantity });

  return <UsersPage data={data} h1={t.users} />;
};
export default Page;
