import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import getT from '@/hooks/getT';
import resourcesService from '@/services/resourcesService';
import { IServerPage } from '@/lib/types';
import ResourcePage from '@/components/Pages/Panel/Resources/ResourcePage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.resource,
    description: t.resource,
  };
};

const Resource: FC<IServerPage> = async ({ params }) => {
  const t = await getT();
  const id = Number(params.id);
  const { data } = await resourcesService.findOne(id);

  if (!data) {
    return notFound();
  }

  return <ResourcePage h1={t.resource} data={data} />;
};
export default Resource;
