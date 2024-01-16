'use client';

import { FC } from 'react';

import PanelPage from '../../PanelPage';
import CreateRoleForm from '@/components/Forms/Panel/Roles/CreateRoleForm';
import { IClientPage } from '@/lib/types';

const NewRolePage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelPage h1={h1}>
      <CreateRoleForm />
    </PanelPage>
  );
};
export default NewRolePage;
