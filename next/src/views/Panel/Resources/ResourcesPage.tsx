'use client';

import { FC, useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { GridRowSelectionModel } from '@mui/x-data-grid/models/gridRowSelectionModel';

import PanelPage from '../../PanelPage';
import ResourcesTable from '@/entities/Tables/ResourcesTable';
import FormButton from '@/kit/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import { IFindAndCountRes } from '@/shared/api/types';
import { IResource } from '@/shared/api/resources/types';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { IClientPage } from '@/views/types';

const ResourcesPage: FC<IClientPage<IFindAndCountRes<IResource>>> = ({
  h1,
  data,
}) => {
  const t = useT();
  const rights = useRights(ROUTES.panel.resources);
  const [findAndCountAll, findAndCountAllReq] =
    resourcesApi.useLazyFindAndCountAllQuery();
  const [findAll, findAllReq] = resourcesApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = resourcesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rows, setRows] = useState(data?.rows || []);
  const [count, setCount] = useState(data?.count || 0);
  const page = useRef(0);
  const pageSize = useRef(25);

  const selectionHandler = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel.map((item) => Number(item)));
  };

  const paginationHandler = (model: GridPaginationModel) => {
    findAll({ page: model.page + 1, quantity: model.pageSize });
    page.current = model.page;
    pageSize.current = model.pageSize;
  };

  const deleteHandler = () => {
    destroy(selectedRows);
  };

  useEffect(() => {
    if (findAllReq.data) {
      setRows(findAllReq.data);
    }
  }, [findAllReq.data]);

  useEffect(() => {
    if (findAndCountAllReq.data) {
      setRows(findAndCountAllReq.data.rows);
      setCount(findAndCountAllReq.data.count);
    }
  }, [findAndCountAllReq.data]);

  useEffect(() => {
    if (destroyReq.data) {
      findAndCountAll({ page: page.current + 1, quantity: pageSize.current });
    }
  }, [destroyReq.data, findAndCountAll]);

  // Needs to be fixed: duplicate initial query (RTK Query does not yet support SSR queries)
  useEffect(() => {
    findAndCountAll({ page: page.current + 1, quantity: pageSize.current });
  }, [findAndCountAll]);

  return (
    <PanelPage h1={h1}>
      <FormButton
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        href={ROUTES.panel.newResource}
      >
        {t.create}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        disabled={
          !rights.deleting || selectedRows.length === 0 || destroyReq.isLoading
        }
        onClick={deleteHandler}
      >
        {t.delete}
      </FormButton>
      <ResourcesTable
        initialState={{
          pagination: {
            paginationModel: { page: page.current, pageSize: pageSize.current },
          },
        }}
        rows={rows}
        rowCount={count}
        loading={findAndCountAllReq.isLoading || findAllReq.isLoading}
        onRowSelectionModelChange={selectionHandler}
        onPaginationModelChange={paginationHandler}
      />
    </PanelPage>
  );
};
export default ResourcesPage;
