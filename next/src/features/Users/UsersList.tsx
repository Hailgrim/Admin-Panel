'use client';

import { FC, useMemo, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridPaginationModel } from '@mui/x-data-grid/models';

import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import { IList } from '@/shared/lib/types';
import { IUser } from '@/shared/api/users/types';
import usersApi from '@/shared/api/users/usersApi';
import UsersTable from '@/entities/Users/UsersTable';

const UsersList: FC<IList<IUser>> = (props) => {
  const t = useT();
  const rights = useRights(ROUTES.api.users);
  const [findAll, findAllReq] = usersApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = usersApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
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
        href={ROUTES.ui.newUser}
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
      <UsersTable
        initialState={{
          pagination: {
            paginationModel: paginationModel.current,
          },
        }}
        rows={items}
        rowCount={count.current}
        loading={findAllReq.isLoading}
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel as string[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default UsersList;
