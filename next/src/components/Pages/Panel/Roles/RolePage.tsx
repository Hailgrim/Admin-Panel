'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelPage from '../../PanelPage';
import UpdateRoleForm from '@/components/Forms/Panel/Roles/UpdateRoleForm';
import { IClientPage, IRoleAndResources } from '@/lib/types';
import useT from '@/hooks/useT';
import UpdateRoleResourcesForm from '@/components/Forms/Panel/Roles/UpdateRoleResourcesForm';

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
