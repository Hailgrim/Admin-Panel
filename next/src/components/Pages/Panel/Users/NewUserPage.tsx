'use client';

import { FC } from 'react';

import PanelPage from '../../PanelPage';
import CreateUserForm from '@/components/Forms/Panel/Users/CreateUserForm';
import { IClientPage } from '@/lib/types';

const NewUserPage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelPage h1={h1}>
      <CreateUserForm />
    </PanelPage>
  );
};
export default NewUserPage;
