'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import { IList } from '@/shared/lib/types';
import RolesList from '@/features/Roles/RolesList';
import { setReqLimit, setReqPage } from '@/views/utils';
import { IRole } from '@ap/shared';

const RolesPage: FC<IPage<IList<IRole>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const reqPage = Number(searchParams.get('reqPage'));
  const reqLimit = Number(searchParams.get('reqLimit'));

  return (
    <PanelLayout h1={h1}>
      <RolesList
        {...data}
        page={reqPage}
        limit={reqLimit}
        onPageUpdate={setReqPage}
        onLimitUpdate={setReqLimit}
      />
    </PanelLayout>
  );
};
export default RolesPage;
