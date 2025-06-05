import { FC } from 'react';
import { Metadata } from 'next/types';

import NewResourcePage from '@/views/Panel/Resources/NewResourcePage';
import { getT } from '@ap/shared';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.newResource,
    description: t.newResource,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <NewResourcePage h1={t.newResource} />;
};
export default Page;
