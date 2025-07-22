import { FC } from 'react';
import { Metadata } from 'next/types';

import usersService from '@/shared/api/users/usersService';
import UsersPage from '@/views/Panel/Users/UsersPage';
import { IAppPage } from '@/app/types';
import { getT } from '@ap/shared/src/locales';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.users,
    description: t.users,
  };
};

const Page: FC<IAppPage> = async ({ searchParams }) => {
  const t = getT();
  const { reqPage, reqLimit } = await searchParams;
  const { data } = await usersService.getList({
    reqPage: Number(reqPage),
    reqLimit: Number(reqLimit),
    reqCount: true,
  });

  return <UsersPage data={data} h1={t.users} />;
};
export default Page;
