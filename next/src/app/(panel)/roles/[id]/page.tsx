import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import rolesService from '@/shared/api/roles/rolesService';
import resourcesService from '@/shared/api/resources/resourcesService';
import RolePage from '@/views/Panel/Roles/RolePage';
import { IServerPage } from '@/views/types';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.role,
    description: t.role,
  };
};

const Role: FC<IServerPage> = async ({ params }) => {
  const t = getT();
  const id = Number(params.id);
  const role = await rolesService.findOne(id);
  const resources = await resourcesService.findAll();

  if (!role.data) {
    return notFound();
  }

  return (
    <RolePage
      h1={t.role}
      data={{ role: role.data, resources: resources.data }}
    />
  );
};
export default Role;
