'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelPage from '../../PanelPage';
import UpdateUserForm from '@/components/Forms/Panel/Users/UpdateUserForm';
import { IClientPage, IUserAndRoles } from '@/lib/types';
import UpdateUserRolesForm from '@/components/Forms/Panel/Users/UpdateUserRolesForm';
import useT from '@/hooks/useT';

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
