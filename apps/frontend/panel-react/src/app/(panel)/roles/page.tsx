import { FC } from 'react';
import { Metadata } from 'next/types';

import rolesService from '@/shared/api/roles/rolesService';
import RolesPage from '@/views/Panel/Roles/RolesPage';
import { IAppPage } from '@/app/types';
import { getT } from '@ap/shared/src/locales';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.roles,
    description: t.roles,
  };
};

const Page: FC<IAppPage> = async ({ searchParams }) => {
  const t = getT();
  const { reqPage, reqLimit } = await searchParams;
  const { data } = await rolesService.getList({
    reqPage: Number(reqPage),
    reqLimit: Number(reqLimit),
    reqCount: true,
  });

  return <RolesPage data={data} h1={t.roles} />;
};
export default Page;
