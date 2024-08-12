'use client';

import { FC } from 'react';

import PanelLayout from '../../PanelLayout';
import CreateResourceForm from '@/features/Resources/CreateResourceForm';
import { IClientPage } from '@/views/types';

const NewResourcePage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelLayout h1={h1}>
      <CreateResourceForm />
    </PanelLayout>
  );
};
export default NewResourcePage;
