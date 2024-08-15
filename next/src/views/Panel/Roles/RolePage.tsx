'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelLayout from '../../PanelLayout';
import UpdateRoleForm from '@/features/Roles/UpdateRoleForm';
import useT from '@/shared/hooks/useT';
import UpdateRoleResourcesForm from '@/features/Roles/UpdateRoleResourcesForm';
import { IRole } from '@/shared/api/roles/types';
import { IPage } from '@/views/types';
import { IResource } from '@/shared/api/resources/types';

const RolePage: FC<
  IPage<{
    role: IRole;
    resources?: IResource[] | null;
  }>
> = ({ h1, data }) => {
  const t = useT();

  return (
    <PanelLayout h1={h1}>
      {data?.role && (
        <>
          <UpdateRoleForm data={data.role} />
          {data.resources && (
            <>
              <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
                {t.resources}
              </Typography>
              <UpdateRoleResourcesForm
                role={data.role}
                resources={data.resources}
              />
            </>
          )}
        </>
      )}
    </PanelLayout>
  );
};
export default RolePage;
