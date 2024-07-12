'use client';

import { FC } from 'react';

import PanelPage from '../../PanelPage';
import UpdateResourceForm from '@/entities/Forms/Panel/Resources/UpdateResourceForm';
import { IResource } from '@/shared/api/resources/types';
import { IClientPage } from '@/views/types';

const ResourcePage: FC<IClientPage<IResource>> = ({ h1, data }) => {
  return (
    <PanelPage h1={h1}>{data && <UpdateResourceForm data={data} />}</PanelPage>
  );
};
export default ResourcePage;
