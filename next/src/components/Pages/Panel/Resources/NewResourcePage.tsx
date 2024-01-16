'use client';

import { FC } from 'react';

import PanelPage from '../../PanelPage';
import CreateResourceForm from '@/components/Forms/Panel/Resources/CreateResourceForm';
import { IClientPage } from '@/lib/types';

const NewResourcePage: FC<IClientPage> = ({ h1 }) => {
  return (
    <PanelPage h1={h1}>
      <CreateResourceForm />
    </PanelPage>
  );
};
export default NewResourcePage;
