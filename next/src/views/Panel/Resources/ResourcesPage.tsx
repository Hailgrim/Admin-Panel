'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import ResourcesList from '@/features/Resources/ResourcesList';
import { IList } from '@/shared/lib/types';
import { setPage, setQuantity } from '@/views/utils';
import { IResource } from '@ap/shared';

const ResourcesPage: FC<IPage<IList<IResource>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page'));
  const quantity = Number(searchParams.get('quantity'));

  return (
    <PanelLayout h1={h1}>
      <ResourcesList
        {...data}
        page={page}
        quantity={quantity}
        onPageUpdate={setPage}
        onQuantityUpdate={setQuantity}
      />
    </PanelLayout>
  );
};
export default ResourcesPage;
