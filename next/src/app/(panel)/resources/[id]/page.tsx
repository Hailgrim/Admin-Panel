import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import resourcesService from '@/shared/api/resources/resourcesService';
import ResourcePage from '@/views/Panel/Resources/ResourcePage';
import { getT } from '@/shared/locales/utils';
import { IServerPage } from '@/views/types';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.resource,
    description: t.resource,
  };
};

const Resource: FC<IServerPage> = async ({ params }) => {
  const t = getT();
  const id = Number(params.id);
  const { data } = await resourcesService.findOne(id);

  if (!data) {
    return notFound();
  }

  return <ResourcePage h1={t.resource} data={data} />;
};
export default Resource;
