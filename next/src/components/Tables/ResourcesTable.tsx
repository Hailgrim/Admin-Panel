import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { FC, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

import useT from '@/hooks/useT';
import { IResource } from '@/lib/types';
import useRights from '@/hooks/useRights';
import { ROUTES } from '@/lib/constants';

const ResourcesTable: FC<Omit<DataGridProps, 'columns'>> = (props) => {
  const t = useT();
  const rights = useRights(ROUTES.panel.resources);

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
              href: ROUTES.panel.resource((params.row as IResource).id),
            })}
            LinkComponent={Link}
            disabled={!rights.reading || (params.row as IResource).default}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      { field: 'id', headerName: t.id, minWidth: 150, type: 'number' },
      {
        field: 'name',
        headerName: t.name,
        minWidth: 250,
        type: 'string',
        flex: 1,
      },
      {
        field: 'path',
        headerName: t.path,
        minWidth: 250,
        type: 'string',
        flex: 1,
      },
      {
        field: 'description',
        headerName: t.description,
        minWidth: 250,
        type: 'string',
        flex: 1,
      },
      { field: 'default', headerName: t.default, width: 150, type: 'boolean' },
    ],
    [t, rights]
  );

  return (
    <DataGrid
      {...props}
      sx={{ width: '100%', minHeight: 200, my: 1 }}
      pageSizeOptions={[25, 50, 100]}
      columns={сolumns}
      isRowSelectable={(params) =>
        rights.deleting && !(params.row as IResource).default
      }
      paginationMode="server"
      checkboxSelection
    />
  );
};
export default ResourcesTable;
