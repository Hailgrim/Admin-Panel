import { FC } from 'react';
import { Metadata } from 'next/types';

import ProfilePage from '@/views/Panel/ProfilePage';
import { getT } from '@ap/shared/src/locales';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = getT();
  return {
    title: t.profile,
    description: t.profile,
  };
};

const Page: FC = async () => {
  const t = getT();
  return <ProfilePage h1={t.profile} />;
};
export default Page;
