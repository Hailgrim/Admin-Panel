'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelPage from '../../PanelPage';
import UpdateUserForm from '@/entities/Forms/Panel/Users/UpdateUserForm';
import UpdateUserRolesForm from '@/entities/Forms/Panel/Users/UpdateUserRolesForm';
import useT from '@/shared/hooks/useT';
import { IClientPage } from '@/views/types';
import { IUserAndRoles } from '@/shared/api/users/types';

const UserPage: FC<IClientPage<IUserAndRoles>> = ({ h1, data }) => {
  const t = useT();

  return (
    <PanelPage h1={h1}>
      {data?.user && (
        <>
          <UpdateUserForm data={data.user} />
          <Typography component="h2" variant="h6" sx={{ my: 1 }}>
            {t.roles}
          </Typography>
          <UpdateUserRolesForm user={data.user} roles={data.roles} />
        </>
      )}
    </PanelPage>
  );
};
export default UserPage;
