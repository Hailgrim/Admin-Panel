'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelLayout from '../../PanelLayout';
import UpdateRoleForm from '@/features/Roles/UpdateRoleForm';
import useTranslate from '@/shared/hooks/useTranslate';
import UpdateRoleRightsForm from '@/features/Roles/UpdateRoleRightsForm';
import { IPage } from '@/views/types';
import { IResource, IRole } from '@ap/shared';

const RolePage: FC<
  IPage<{
    role: IRole;
    resources?: IResource[] | null;
  }>
> = ({ h1, data }) => {
  const t = useTranslate();

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
              <UpdateRoleRightsForm
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
