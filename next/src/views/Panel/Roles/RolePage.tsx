'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelPage from '../../PanelPage';
import UpdateRoleForm from '@/entities/Forms/Panel/Roles/UpdateRoleForm';
import useT from '@/shared/hooks/useT';
import UpdateRoleResourcesForm from '@/entities/Forms/Panel/Roles/UpdateRoleResourcesForm';
import { IRoleAndResources } from '@/shared/api/roles/types';
import { IClientPage } from '@/views/types';

const RolePage: FC<IClientPage<IRoleAndResources>> = ({ h1, data }) => {
  const t = useT();

  return (
    <PanelPage h1={h1}>
      {data?.role && (
        <>
          <UpdateRoleForm data={data.role} />
          <Typography component="h2" variant="h6" sx={{ my: 1 }}>
            {t.resources}
          </Typography>
          <UpdateRoleResourcesForm
            role={data.role}
            resources={data.resources}
          />
        </>
      )}
    </PanelPage>
  );
};
export default RolePage;
