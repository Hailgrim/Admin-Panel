import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import rolesService from '@/services/rolesService';
import RolesPage from '@/components/Pages/Panel/Roles/RolesPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.roles,
    description: t.roles,
  };
};

const Roles: FC = async () => {
  const t = await getT();
  const { data } = await rolesService.findAndCountAll();
  return <RolesPage h1={t.roles} data={data} />;
};
export default Roles;
