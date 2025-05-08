import { FC } from 'react';
import { Metadata } from 'next/types';

import resourcesService from '@/shared/api/resources/resourcesService';
import { IAppPage } from '@/app/types';
import ResourcesPage from '@/views/Panel/Resources/ResourcesPage';
import { getT } from '@ap/shared';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.resources,
    description: t.resources,
  };
};

const Page: FC<IAppPage> = async (props) => {
  const t = getT();
  const page = Number(props.searchParams.page) || 1;
  const quantity = Number(props.searchParams.quantity) || 25;
  const { data } = await resourcesService.getList({
    reqPage: page,
    reqLimit: quantity,
    reqCount: true,
  });

  return <ResourcesPage data={data} h1={t.resources} />;
};
export default Page;
