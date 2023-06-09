import React from 'react';
import { GridColDef, GridSelectionModel } from '@mui/x-data-grid';

import lang from '../../libs/lang';
import rolesApi from '../../store/api/rolesApi';
import { IFindAndCountRes, IPagination, IRole } from '../../libs/types';
import DataGridStyled from '../../components/Other/DataGridStyled';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import TableActions from './TableActions';
import { addAlert } from '../../store/slices/appSlice';
import EditButton from './EditButton';
import { isAllowed, makeErrorText } from '../../libs/functions';
import { ROUTES } from '../../libs/config';
import { Rights } from '../../libs/constants';

const RoleTable: React.FC<{
  data?: IFindAndCountRes<IRole> | null;
  pagination?: IPagination;
}> = ({ data, pagination }) => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [page, setPage] = React.useState(pagination?.page || 1);
  const [quantity, setQuantity] = React.useState(pagination?.quantity || 100);
  const [destroyStatus, setDestroyStatus] = React.useState(false);
  const [rows, setRows] = React.useState<IRole[]>(data?.rows || []);
  const counter = data?.count || 0;
  const [findAll, findAllReq] = rolesApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = rolesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

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
          route={ROUTES.panel.roles}
          link={ROUTES.panel.getRoleRoute(params.row.id)}
          selectable={params.row.admin !== true}
        />
      ),
    },
    { field: 'id', headerName: lang.get(userLang)?.id, minWidth: 150, type: 'number' },
    { field: 'name', headerName: lang.get(userLang)?.name, minWidth: 250, type: 'string', flex: 1 },
    { field: 'description', headerName: lang.get(userLang)?.description, minWidth: 250, type: 'string', flex: 1 },
    { field: 'admin', headerName: lang.get(userLang)?.admin, width: 150, type: 'boolean' },
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
          link: ROUTES.panel.newRole,
          disabled: !isAllowed(ROUTES.panel.roles, Rights.Creating, profile?.roles),
        }}
        destroy={{
          action: () => destroy(selectedRows),
          disabled:
            selectedRows.length == 0 ||
            !isAllowed(ROUTES.panel.roles, Rights.Deleting, profile?.roles),
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
        isRowSelectable={params => params.row.default !== true}
      />
    </React.Fragment>
  );
};
export default RoleTable;
