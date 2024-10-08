import { FC } from 'react';
import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import resourcesService from '@/shared/api/resources/resourcesService';
import ResourcePage from '@/views/Panel/Resources/ResourcePage';
import { getT } from '@/shared/locales/utils';
import { IAppPage } from '@/app/types';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.resource,
    description: t.resource,
  };
};

const Page: FC<IAppPage> = async ({ params }) => {
  const t = getT();
  const id = Number(params.id);

  if (id) {
    const { data } = await resourcesService.findOne(id);
    return <ResourcePage h1={t.resource} data={data} />;
  }

  return notFound();
};
export default Page;
