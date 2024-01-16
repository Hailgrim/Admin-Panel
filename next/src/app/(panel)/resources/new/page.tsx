import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import NewResourcePage from '@/components/Pages/Panel/Resources/NewResourcePage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.newResource,
    description: t.newResource,
  };
};

const NewResource: FC = async () => {
  const t = await getT();
  return <NewResourcePage h1={t.newResource} />;
};
export default NewResource;
