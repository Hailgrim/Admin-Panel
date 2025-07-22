'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import { IList } from '@/shared/lib/types';
import UsersList from '@/features/Users/UsersList';
import { setReqLimit, setReqPage } from '@/views/utils';
import { IUser } from '@ap/shared/src/types';

const UsersPage: FC<IPage<IList<IUser>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const reqPage = Number(searchParams.get('reqPage'));
  const reqLimit = Number(searchParams.get('reqLimit'));

  return (
    <PanelLayout h1={h1}>
      <UsersList
        {...data}
        page={reqPage}
        limit={reqLimit}
        onPageUpdate={setReqPage}
        onLimitUpdate={setReqLimit}
      />
    </PanelLayout>
  );
};
export default UsersPage;
