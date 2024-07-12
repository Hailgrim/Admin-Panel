'use client';

import { FC } from 'react';

import PanelPage from '../PanelPage';
import UpdateProfileForm from '@/entities/Forms/Auth/UpdateProfileForm';
import { IClientPage } from '../types';

const ProfilePage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelPage h1={h1}>
      <UpdateProfileForm />
    </PanelPage>
  );
};
export default ProfilePage;
