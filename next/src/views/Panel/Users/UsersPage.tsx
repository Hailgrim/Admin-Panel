'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import { IList } from '@/shared/lib/types';
import { IUser } from '@/shared/api/users/types';
import UsersList from '@/features/Users/UsersList';
import { setPage, setQuantity } from '@/views/utils';

const UsersPage: FC<IPage<IList<IUser>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page'));
  const quantity = Number(searchParams.get('quantity'));

  return (
    <PanelLayout h1={h1}>
      <UsersList
        {...data}
        page={page}
        quantity={quantity}
        onPageUpdate={setPage}
        onQuantityUpdate={setQuantity}
      />
    </PanelLayout>
  );
};
export default UsersPage;
