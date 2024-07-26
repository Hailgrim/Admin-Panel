'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelPage from '../../PanelPage';
import UpdateUserForm from '@/entities/Forms/Users/UpdateUserForm';
import UpdateUserRolesForm from '@/entities/Forms/Users/UpdateUserRolesForm';
import useT from '@/shared/hooks/useT';
import { IClientPage } from '@/views/types';
import { IUser } from '@/shared/api/users/types';
import { IRole } from '@/shared/api/roles/types';

const UserPage: FC<
  IClientPage<{
    user: IUser;
    roles?: IRole[] | null;
  }>
> = ({ h1, data }) => {
  const t = useT();

  return (
    <PanelPage h1={h1}>
      {data?.user && (
        <>
          <UpdateUserForm data={data.user} />
          {data.roles && (
            <>
              <Typography component="h2" variant="h6" sx={{ my: 1 }}>
                {t.roles}
              </Typography>
              <UpdateUserRolesForm user={data.user} roles={data.roles} />
            </>
          )}
        </>
      )}
    </PanelPage>
  );
};
export default UserPage;
