'use client';

import { FC, useMemo, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridPaginationModel } from '@mui/x-data-grid/models';

import ResourcesTable from '@/entities/Resources/ResourcesTable';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { IResource } from '@/shared/api/resources/types';
import { IList } from '@/shared/lib/types';

const ResourcesList: FC<IList<IResource>> = (props) => {
  const t = useT();
  const rights = useRights(ROUTES.api.resources);
  const [findAll, findAllReq] = resourcesApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = resourcesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const items = useMemo(
    () => findAllReq.data || props.rows || [],
    [props.rows, findAllReq.data]
  );
  const paginationModel = useRef<GridPaginationModel>({
    page: props.page || 0,
    pageSize: props.quantity || 25,
  });
  const count = useRef(
    props.count ||
      (paginationModel.current.page + 1) * paginationModel.current.pageSize
  );

  const paginationHandler = (model: GridPaginationModel) => {
    findAll({ page: model.page + 1, quantity: model.pageSize });
    props.onPaginationUpdate?.(model);
  };

  return (
    <>
      <FormButton
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        href={ROUTES.ui.newResource}
      >
        {t.create}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        disabled={
          !rights.deleting || selectedRows.length === 0 || destroyReq.isLoading
        }
        onClick={() => destroy(selectedRows)}
      >
        {t.delete}
      </FormButton>
      <ResourcesTable
        initialState={{
          pagination: {
            paginationModel: paginationModel.current,
          },
        }}
        rows={items}
        rowCount={count.current}
        loading={findAllReq.isLoading}
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel as number[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default ResourcesList;
