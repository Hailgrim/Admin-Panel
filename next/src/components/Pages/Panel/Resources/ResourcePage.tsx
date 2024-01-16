'use client';

import { FC } from 'react';

import PanelPage from '../../PanelPage';
import UpdateResourceForm from '@/components/Forms/Panel/Resources/UpdateResourceForm';
import { IClientPage, IResource } from '@/lib/types';

const ResourcePage: FC<IClientPage<IResource>> = ({ h1, data }) => {
  return (
    <PanelPage h1={h1}>{data && <UpdateResourceForm data={data} />}</PanelPage>
  );
};
export default ResourcePage;
