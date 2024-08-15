'use client';

import { FC } from 'react';

import PanelLayout from '../../PanelLayout';
import UpdateResourceForm from '@/features/Resources/UpdateResourceForm';
import { IResource } from '@/shared/api/resources/types';
import { IPage } from '@/views/types';

const ResourcePage: FC<IPage<IResource>> = ({ h1, data }) => {
  return (
    <PanelLayout h1={h1}>
      {data && <UpdateResourceForm data={data} />}
    </PanelLayout>
  );
};
export default ResourcePage;
