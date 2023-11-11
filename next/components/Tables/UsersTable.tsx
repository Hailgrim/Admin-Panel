import React from 'react';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';

import lang from '../../lib/lang';
import usersApi from '../../store/api/usersApi';
import { IFindAndCountRes, IPagination, IRole, IUser } from '../../lib/types';
import DataGridStyled from '../Other/DataGridStyled';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import TableActions from './TableActions';
import { addAlert } from '../../store/slices/appSlice';
import EditButton from './EditButton';
import { makeErrorText } from '../../lib/functions';
import { ROUTES } from '../../lib/constants';
import useRights from '../../hooks/useRights';

const UsersTable: React.FC<{
  data?: IFindAndCountRes<IUser> | null;
  pagination?: IPagination;
}> = ({ data, pagination }) => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const [page, setPage] = React.useState(pagination?.page || 1);
  const [quantity, setQuantity] = React.useState(pagination?.quantity || 25);
  const [destroyStatus, setDestroyStatus] = React.useState(false);
  const [rows, setRows] = React.useState<IUser[]>(data?.rows || []);
  const counter = data?.count || 0;
  const [findAll, findAllReq] = usersApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = usersApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const rights = useRights(ROUTES.api.roles);

  const сolumns: GridColDef[] = React.useMemo(() => ([
    {
      field: 'edit',
      headerName: lang.get(userLang)?.edit,
      width: 50,
      type: 'boolean',
      sortable: false,
      disableColumnMenu: true,
      renderCell: params => (
        <EditButton
          route={ROUTES.panel.users}
          link={ROUTES.panel.user(params.row.id)}
        />
      ),
    },
    { field: 'id', headerName: lang.get(userLang)?.id, minWidth: 150, type: 'number' },
    { field: 'email', headerName: lang.get(userLang)?.email, minWidth: 250, type: 'string', flex: 1 },
    { field: 'name', headerName: lang.get(userLang)?.name, minWidth: 250, type: 'string', flex: 1 },
    {
      field: 'roles',
      headerName: lang.get(userLang)?.roles,
      minWidth: 250,
      type: 'string',
      flex: 1,
      valueFormatter: params => params.value.map((role: IRole) => role.name).join(', '),
    },
    { field: 'verified', headerName: lang.get(userLang)?.verified, width: 150, type: 'boolean' },
    { field: 'enabled', headerName: lang.get(userLang)?.enabled, width: 150, type: 'boolean' },
  ]), [userLang]);

  const setPageHandler = (newPage: number) => {
    setPage(newPage);
    findAll({ page: newPage, quantity });
  };

  const setQuantityHandler = (newQuantity: number) => {
    setQuantity(newQuantity);
    findAll({ page, quantity: newQuantity });
  };

  const setSelectedRowsHandler = (model: GridSelectionModel) => {
    setSelectedRows(model.map(value => Number(value)));
  };

  React.useEffect(() => {
    if (findAllReq.isLoading) {
      return;
    }
    if (findAllReq.data && !findAllReq.error) {
      setRows(findAllReq.data);
    }
    if (findAllReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(findAllReq.error, userLang) }));
    }
  }, [
    findAllReq.data, findAllReq.error, findAllReq.isLoading,
    dispatch, userLang,
  ]);

  React.useEffect(() => {
    if (destroyReq.isLoading) {
      return;
    }
    if (destroyReq.data && !destroyReq.error) {
      setDestroyStatus(true);
    }
    if (destroyReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(destroyReq.error, userLang) }));
    }
  }, [
    destroyReq.data, destroyReq.error, destroyReq.isLoading,
    dispatch, userLang,
  ]);

  React.useEffect(() => {
    if (destroyStatus) {
      setDestroyStatus(false);
      findAll({ page, quantity });
    }
  }, [findAll, page, quantity, destroyStatus]);

  return (
    <React.Fragment>
      <TableActions
        create={{
          link: ROUTES.panel.newUser,
          disabled: !rights.creating,
        }}
        destroy={{
          action: () => destroy(selectedRows),
          disabled:
            selectedRows.length == 0 ||
            !rights.deleting,
          loading: destroyReq.isLoading,
        }}
      />
      <DataGridStyled
        rows={rows}
        columns={сolumns}
        pageSize={quantity}
        rowCount={counter}
        onPageSizeChange={setQuantityHandler}
        onPageChange={setPageHandler}
        loading={destroyReq.isLoading || findAllReq.isLoading}
        checkboxSelection
        onSelectionModelChange={setSelectedRowsHandler}
        selectionModel={selectedRows}
      />
    </React.Fragment>
  );
};
export default UsersTable;
