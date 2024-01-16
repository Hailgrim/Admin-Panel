import { FC } from 'react';
import { Metadata } from 'next/types';

import getT from '@/hooks/getT';
import ProfilePage from '@/components/Pages/Panel/ProfilePage';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getT();
  return {
    title: t.profile,
    description: t.profile,
  };
};

const Profile: FC = async () => {
  const t = await getT();
  return <ProfilePage h1={t.profile} />;
};
export default Profile;
