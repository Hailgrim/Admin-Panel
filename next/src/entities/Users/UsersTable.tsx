import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { FC, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

import useT from '@/shared/hooks/useT';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import { IRole } from '@/shared/api/roles/types';
import { IUser } from '@/shared/api/users/types';

const UsersTable: FC<Omit<DataGridProps<IUser>, 'columns'>> = (props) => {
  const t = useT();
  const rights = useRights(ROUTES.api.users);

  const сolumns: GridColDef<IUser>[] = useMemo(
    () => [
      {
        field: 'edit',
        headerName: t.edit,
        width: 50,
        type: 'boolean',
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <IconButton
            {...(rights.reading && {
              href: ROUTES.ui.user(params.row.id),
            })}
            LinkComponent={Link}
            disabled={!rights.reading}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      { field: 'id', headerName: t.id, minWidth: 150, type: 'string' },
      {
        field: 'email',
        headerName: t.email,
        minWidth: 250,
        type: 'string',
        flex: 1,
      },
      {
        field: 'name',
        headerName: t.name,
        minWidth: 250,
        type: 'string',
        flex: 1,
      },
      {
        field: 'roles',
        headerName: t.roles,
        minWidth: 250,
        type: 'string',
        flex: 1,
        renderCell: (params) =>
          params.value.map((role: IRole) => role.name).join(', '),
      },
      {
        field: 'verified',
        headerName: t.verified,
        width: 150,
        type: 'boolean',
      },
      { field: 'enabled', headerName: t.enabled, width: 150, type: 'boolean' },
    ],
    [t, rights]
  );

  return (
    <DataGrid<IUser>
      {...props}
      sx={{ width: '100%', minHeight: 200, my: 1 }}
      pageSizeOptions={[25, 50, 100]}
      columns={сolumns}
      isRowSelectable={(params) =>
        rights.deleting && !params.row.roles?.some((role) => role.admin)
      }
      paginationMode="server"
      checkboxSelection
    />
  );
};
export default UsersTable;
