'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridRowSelectionModel } from '@mui/x-data-grid/models/gridRowSelectionModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import PanelPage from '../../PanelPage';
import UsersTable from '@/entities/Tables/UsersTable';
import FormButton from '@/shared/kit/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import { IFindAndCountRes } from '@/shared/api/types';
import usersApi from '@/shared/api/users/usersApi';
import { IClientPage } from '@/views/types';
import { IUser } from '@/shared/api/users/types';

const UsersPage: FC<IClientPage<IFindAndCountRes<IUser>>> = ({ h1, data }) => {
  const t = useT();
  const rights = useRights(ROUTES.panel.users);
  const [findAndCountAll, findAndCountAllReq] =
    usersApi.useLazyFindAndCountAllQuery();
  const [findAll, findAllReq] = usersApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = usersApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [rows, setRows] = useState(data?.rows || []);
  const [count, setCount] = useState(data?.count || 0);
  const page = useRef(0);
  const pageSize = useRef(25);

  const selectionHandler = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel as string[]);
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
        href={ROUTES.panel.newUser}
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
      <UsersTable
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
export default UsersPage;
