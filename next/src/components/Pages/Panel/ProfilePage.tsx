'use client';

import { FC } from 'react';

import { IClientPage } from '@/lib/types';
import PanelPage from '../PanelPage';
import UpdateProfileForm from '@/components/Forms/Auth/UpdateProfileForm';

const ProfilePage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelPage h1={h1}>
      <UpdateProfileForm />
    </PanelPage>
  );
};
export default ProfilePage;
