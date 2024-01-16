import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import resourcesService from '@/services/resourcesService';
import ResourcesPage from '@/components/Pages/Panel/Resources/ResourcesPage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.resources,
    description: t.resources,
  };
};

const Resources: FC = async () => {
  const t = await getT();
  const { data } = await resourcesService.findAndCountAll();
  return <ResourcesPage h1={t.resources} data={data} />;
};
export default Resources;
