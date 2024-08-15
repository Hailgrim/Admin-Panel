'use client';

import { FC } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid/models';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IResource } from '@/shared/api/resources/types';
import { IPage } from '@/views/types';
import ResourcesList from '@/features/Resources/ResourcesList';
import { IList } from '@/shared/lib/types';

const ResourcesPage: FC<IPage<IList<IResource>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1;
  const quantity = Number(searchParams.get('quantity'));

  const paginationHandler = (model: GridPaginationModel) => {
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', String(model.page + 1));
    queryParams.set('quantity', String(model.pageSize));
    history.pushState(null, '', `?${queryParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <ResourcesList
        {...data}
        page={page}
        quantity={quantity}
        onPaginationUpdate={paginationHandler}
      />
    </PanelLayout>
  );
};
export default ResourcesPage;
