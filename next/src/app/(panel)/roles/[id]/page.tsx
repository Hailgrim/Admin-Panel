import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import getT from '@/hooks/getT';
import rolesService from '@/services/rolesService';
import resourcesService from '@/services/resourcesService';
import { IServerPage } from '@/lib/types';
import RolePage from '@/components/Pages/Panel/Roles/RolePage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.role,
    description: t.role,
  };
};

const Role: FC<IServerPage> = async ({ params }) => {
  const t = await getT();
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
