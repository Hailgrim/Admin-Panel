import { FC } from 'react';
import { Metadata } from 'next/types';

import NewRolePage from '@/views/Panel/Roles/NewRolePage';
import { getT } from '@/shared/locales/utils';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.newRole,
    description: t.newRole,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <NewRolePage h1={t.newRole} />;
};
export default Page;
