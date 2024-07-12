import { FC } from 'react';
import { Metadata } from 'next/types';

import rolesService from '@/shared/api/roles/rolesService';
import RolesPage from '@/views/Panel/Roles/RolesPage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.roles,
    description: t.roles,
  };
};

const Roles: FC = async () => {
  const t = getT();
  const { data } = await rolesService.findAndCountAll();
  return <RolesPage h1={t.roles} data={data} />;
};
export default Roles;
