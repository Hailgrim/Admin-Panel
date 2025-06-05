'use client';

import { FC } from 'react';

import PanelLayout from '../../PanelLayout';
import UpdateResourceForm from '@/features/Resources/UpdateResourceForm';
import { IPage } from '@/views/types';
import { IResource } from '@ap/shared';

const ResourcePage: FC<IPage<IResource>> = ({ h1, data }) => {
  return (
    <PanelLayout h1={h1}>
      {data && <UpdateResourceForm data={data} />}
    </PanelLayout>
  );
};
export default ResourcePage;
