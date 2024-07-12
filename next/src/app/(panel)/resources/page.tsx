import { FC } from 'react';
import { Metadata } from 'next/types';

import resourcesService from '@/shared/api/resources/resourcesService';
import ResourcesPage from '@/views/Panel/Resources/ResourcesPage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.resources,
    description: t.resources,
  };
};

const Resources: FC = async () => {
  const t = getT();
  const { data } = await resourcesService.findAndCountAll();
  return <ResourcesPage h1={t.resources} data={data} />;
};
export default Resources;
