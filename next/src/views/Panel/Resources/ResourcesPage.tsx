'use client';

import { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import PanelLayout from '../../PanelLayout';
import { IPage } from '@/views/types';
import ResourcesList from '@/features/Resources/ResourcesList';
import { IList } from '@/shared/lib/types';
import { setReqLimit, setReqPage } from '@/views/utils';
import { IResource } from '@ap/shared';

const ResourcesPage: FC<IPage<IList<IResource>>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const reqPage = Number(searchParams.get('reqPage'));
  const reqLimit = Number(searchParams.get('reqLimit'));

  return (
    <PanelLayout h1={h1}>
      <ResourcesList
        {...data}
        page={reqPage}
        limit={reqLimit}
        onPageUpdate={setReqPage}
        onLimitUpdate={setReqLimit}
      />
    </PanelLayout>
  );
};
export default ResourcesPage;
