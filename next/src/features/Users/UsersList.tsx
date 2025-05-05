'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import { useAppDispatch } from '@/shared/store/hooks';
import useLang from '@/shared/hooks/useLang';
import { addAlert } from '@/shared/store/main/main';
import { makeErrorText } from '@/shared/lib/utils';

const UsersList: FC<IList<IUser>> = (props) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const rights = useRights(ROUTES.api.users);
  const [findAll, findAllReq] = usersApi.useLazyFindAllQuery();
  const [destroy, destroyReq] = usersApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [items, setItems] = useState(props.rows);
  const paginationModel = useRef<GridPaginationModel>({
    page: (props.page || 1) - 1,
    pageSize: props.quantity || 25,
  });
  const count = useMemo(
    () =>
      findAllReq.data?.count ||
      props.count ||
      paginationModel.current.page * paginationModel.current.pageSize,
    [props.count, findAllReq.data]
  );

  const paginationHandler = (model: GridPaginationModel) => {
    findAll({ reqPage: model.page + 1, reqLimit: model.pageSize });
    paginationModel.current = model;
    props.onPageUpdate?.(model.page + 1);
    props.onQuantityUpdate?.(model.pageSize);
  };

  useEffect(() => {
    if (!props.rows) {
      findAll({
        reqPage: paginationModel.current.page + 1,
        reqLimit: paginationModel.current.pageSize,
      });
    }
  }, [props.rows, findAll]);

  useEffect(() => {
    if (destroyReq.data) {
      findAll({
        reqPage: paginationModel.current.page + 1,
        reqLimit: paginationModel.current.pageSize,
      });
    }
  }, [destroyReq.data, findAll]);

  useEffect(() => {
    if (destroyReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(destroyReq.error, lang.current),
        })
      );
    }
  }, [dispatch, destroyReq.error, lang]);

  useEffect(() => {
    if (findAllReq.data) {
      setItems(findAllReq.data.rows);
    }
  }, [findAllReq.data]);

  useEffect(() => {
    if (findAllReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(findAllReq.error, lang.current),
        })
      );
    }
  }, [dispatch, findAllReq.error, lang]);

  useEffect(() => {
    if (findAllReq.data?.rows) {
      setItems(findAllReq.data?.rows);
    }
  }, [findAllReq.data]);

  useEffect(() => {
    if (findAllReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(findAllReq.error, lang.current),
        })
      );
    }
  }, [dispatch, findAllReq.error, lang]);

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
        onClick={() => destroy({ items: selectedRows })}
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
        rowCount={count}
        loading={findAllReq.isLoading || destroyReq.isLoading}
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel as string[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default UsersList;
