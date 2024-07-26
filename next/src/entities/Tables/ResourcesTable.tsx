import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { FC, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

import useT from '@/shared/hooks/useT';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import { IResource } from '@/shared/api/resources/types';

const ResourcesTable: FC<Omit<DataGridProps<IResource>, 'columns'>> = (
  props
) => {
  const t = useT();
  const rights = useRights(ROUTES.panel.resources);

  const сolumns: GridColDef<IResource>[] = useMemo(
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
              href: ROUTES.panel.resource(params.row.id),
            })}
            LinkComponent={Link}
            disabled={!rights.reading || params.row.default}
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
      { field: 'enabled', headerName: t.enabled, width: 150, type: 'boolean' },
    ],
    [t, rights]
  );

  return (
    <DataGrid<IResource>
      {...props}
      sx={{ width: '100%', minHeight: 200, my: 1 }}
      pageSizeOptions={[25, 50, 100]}
      columns={сolumns}
      isRowSelectable={(params) => rights.deleting && !params.row.default}
      paginationMode="server"
      checkboxSelection
    />
  );
};
export default ResourcesTable;
