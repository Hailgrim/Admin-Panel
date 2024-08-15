'use client';

import { FC } from 'react';
import Typography from '@mui/material/Typography';

import PanelLayout from '../../PanelLayout';
import UpdateUserForm from '@/features/Users/UpdateUserForm';
import UpdateUserRolesForm from '@/features/Users/UpdateUserRolesForm';
import useT from '@/shared/hooks/useT';
import { IPage } from '@/views/types';
import { IUser } from '@/shared/api/users/types';
import { IRole } from '@/shared/api/roles/types';

const UserPage: FC<
  IPage<{
    user: IUser;
    roles?: IRole[] | null;
  }>
> = ({ h1, data }) => {
  const t = useT();

  return (
    <PanelLayout h1={h1}>
      {data?.user && (
        <>
          <UpdateUserForm data={data.user} />
          {data.roles && (
            <>
              <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
                {t.roles}
              </Typography>
              <UpdateUserRolesForm user={data.user} roles={data.roles} />
            </>
          )}
        </>
      )}
    </PanelLayout>
  );
};
export default UserPage;
