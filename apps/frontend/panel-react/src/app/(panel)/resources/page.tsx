import { FC } from 'react';
import { Metadata } from 'next/types';

import resourcesService from '@/shared/api/resources/resourcesService';
import { IAppPage } from '@/app/types';
import ResourcesPage from '@/views/Panel/Resources/ResourcesPage';
import { getT } from '@ap/shared/src/locales';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.resources,
    description: t.resources,
  };
};

const Page: FC<IAppPage> = async ({ searchParams }) => {
  const t = getT();
  const { reqPage, reqLimit } = await searchParams;
  const { data } = await resourcesService.getList({
    reqPage: Number(reqPage),
    reqLimit: Number(reqLimit),
    reqCount: true,
  });

  return <ResourcesPage data={data} h1={t.resources} />;
};
export default Page;
