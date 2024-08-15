'use client';

import { FC } from 'react';

import PanelLayout from '../../PanelLayout';
import CreateRoleForm from '@/features/Roles/CreateRoleForm';
import { IPage } from '@/views/types';

const NewRolePage: FC<IPage> = ({ h1 }) => {
  return (
    <PanelLayout h1={h1}>
      <CreateRoleForm />
    </PanelLayout>
  );
};
export default NewRolePage;
