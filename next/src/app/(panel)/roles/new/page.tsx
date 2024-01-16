import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import NewRolePage from '@/components/Pages/Panel/Roles/NewRolePage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.newRole,
    description: t.newRole,
  };
};

const NewRole: FC = async () => {
  const t = await getT();
  return <NewRolePage h1={t.newRole} />;
};
export default NewRole;
