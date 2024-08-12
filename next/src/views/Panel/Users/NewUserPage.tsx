'use client';

import { FC } from 'react';

import PanelLayout from '../../PanelLayout';
import CreateUserForm from '@/features/Users/CreateUserForm';
import { IClientPage } from '@/views/types';

const NewUserPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelLayout h1={h1}>
      <CreateUserForm />
    </PanelLayout>
  );
};
export default NewUserPage;
