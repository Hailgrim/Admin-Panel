'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelPage from '../../PanelPage';
import UpdateRoleForm from '@/entities/Forms/Roles/UpdateRoleForm';
import useT from '@/shared/hooks/useT';
import UpdateRoleResourcesForm from '@/entities/Forms/Roles/UpdateRoleResourcesForm';
import { IRole } from '@/shared/api/roles/types';
import { IClientPage } from '@/views/types';
import { IResource } from '@/shared/api/resources/types';

const RolePage: FC<
  IClientPage<{
    role: IRole;
    resources?: IResource[] | null;
  }>
> = ({ h1, data }) => {
  const t = useT();

  return (
    <PanelPage h1={h1}>
      {data?.role && (
        <>
          <UpdateRoleForm data={data.role} />
          {data.resources && (
            <>
              <Typography component="h2" variant="h6" sx={{ my: 1 }}>
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
    </PanelPage>
  );
};
export default RolePage;
