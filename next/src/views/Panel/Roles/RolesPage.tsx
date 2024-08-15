'use client';

import { FC } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid/models';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import { IList } from '@/shared/lib/types';
import { IRole } from '@/shared/api/roles/types';
import RolesList from '@/features/Roles/RolesList';

const RolesPage: FC<IPage<IList<IRole>>> = ({ h1, data }) => {
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
      <RolesList
        {...data}
        page={page}
        quantity={quantity}
        onPaginationUpdate={paginationHandler}
      />
    </PanelLayout>
  );
};
export default RolesPage;
