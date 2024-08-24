'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import { IList } from '@/shared/lib/types';
import { IRole } from '@/shared/api/roles/types';
import RolesList from '@/features/Roles/RolesList';
import { setPage, setQuantity } from '@/views/utils';

const RolesPage: FC<IPage<IList<IRole>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page'));
  const quantity = Number(searchParams.get('quantity'));

  return (
    <PanelLayout h1={h1}>
      <RolesList
        {...data}
        page={page}
        quantity={quantity}
        onPageUpdate={setPage}
        onQuantityUpdate={setQuantity}
      />
    </PanelLayout>
  );
};
export default RolesPage;
