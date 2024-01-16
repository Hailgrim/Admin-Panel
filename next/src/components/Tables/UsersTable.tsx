import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { FC, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

import useT from '@/hooks/useT';
import { IRole, IUser } from '@/lib/types';
import useRights from '@/hooks/useRights';
import { ROUTES } from '@/lib/constants';

const UsersTable: FC<Omit<DataGridProps, 'columns'>> = (props) => {
  const t = useT();
  const rights = useRights(ROUTES.panel.users);

  const сolumns: GridColDef[] = useMemo(
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
              href: ROUTES.panel.user((params.row as IUser).id),
            })}
            LinkComponent={Link}
            disabled={!rights.reading}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      { field: 'id', headerName: t.id, minWidth: 150, type: 'number' },
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
        valueFormatter: (params) =>
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
    <>
      <DataGrid
        {...props}
        sx={{ width: '100%', minHeight: 200, my: 1 }}
        pageSizeOptions={[25, 50, 100]}
        columns={сolumns}
        isRowSelectable={(params) =>
          rights.deleting &&
          !(params.row as IUser).roles?.some((role) => role.admin)
        }
        paginationMode="server"
        checkboxSelection
      />
    </>
  );
};
export default UsersTable;
