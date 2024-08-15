import { FC } from 'react';
import { Metadata } from 'next/types';

import rolesService from '@/shared/api/roles/rolesService';
import RolesPage from '@/views/Panel/Roles/RolesPage';
import { getT } from '@/shared/locales/utils';
import { IAppPage } from '@/app/types';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.roles,
    description: t.roles,
  };
};

const Page: FC<IAppPage> = async (props) => {
  const t = getT();
  const page = Number(props.searchParams.page) || 1;
  const quantity = Number(props.searchParams.quantity) || 25;
  const { data } = await rolesService.findAndCountAll({ page, quantity });

  return <RolesPage data={data} h1={t.roles} />;
};
export default Page;
