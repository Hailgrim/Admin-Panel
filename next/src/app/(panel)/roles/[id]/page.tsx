import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import rolesService from '@/shared/api/roles/rolesService';
import resourcesService from '@/shared/api/resources/resourcesService';
import RolePage from '@/views/Panel/Roles/RolePage';
import { IAppPage } from '@/app/types';
import { getT } from '@ap/shared';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.role,
    description: t.role,
  };
};

const Page: FC<IAppPage> = async ({ params }) => {
  const t = getT();
  const id = params.id;

  if (id) {
    const role = await rolesService.getOne(id);
    const resources = await resourcesService.getList();

    if (role.data) {
      return (
        <RolePage
          h1={t.role}
          data={{ role: role.data, resources: resources.data?.rows }}
        />
      );
    }
  }

  return notFound();
};
export default Page;
