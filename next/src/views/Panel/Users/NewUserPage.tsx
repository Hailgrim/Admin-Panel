'use client';

import { FC } from 'react';

import PanelPage from '../../PanelPage';
import CreateUserForm from '@/entities/Forms/Panel/Users/CreateUserForm';
import { IClientPage } from '@/views/types';

const NewUserPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelPage h1={h1}>
      <CreateUserForm />
    </PanelPage>
  );
};
export default NewUserPage;
