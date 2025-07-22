'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridPaginationModel } from '@mui/x-data-grid/models';

import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import useTranslate from '@/shared/hooks/useTranslate';
import { IList } from '@/shared/lib/types';
import RolesTable from '@/entities/Roles/RolesTable';
import rolesApi from '@/shared/api/roles/rolesApi';
import { useAppDispatch } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import { IRole } from '@ap/shared/src/types';
import { getErrorText, ROUTES } from '@ap/shared/src/libs';

const RolesList: FC<IList<IRole>> = (props) => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const t = useTranslate();
  const rights = useRights(ROUTES.api.roles);
  const [getList, getListReq] = rolesApi.useLazyGetListQuery();
  const [destroy, destroyReq] = rolesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [items, setItems] = useState(props.rows);
  const paginationModel = useRef<GridPaginationModel>({
    page: (props.page || 1) - 1,
    pageSize: props.limit || 25,
  });
  const count = useMemo(
    () =>
      getListReq.data?.count ||
      props.count ||
      paginationModel.current.page * paginationModel.current.pageSize,
    [props.count, getListReq.data]
  );

  const paginationHandler = (model: GridPaginationModel) => {
    getList({ reqPage: model.page + 1, reqLimit: model.pageSize });

    if (props.onPageUpdate && model.page !== paginationModel.current.page) {
      props.onPageUpdate(model.page + 1);
    }

    if (
      props.onLimitUpdate &&
      model.pageSize !== paginationModel.current.pageSize
    ) {
      props.onLimitUpdate(model.pageSize);
    }

    paginationModel.current = model;
  };

  useEffect(() => {
    if (!props.rows) {
      getList({
        reqPage: paginationModel.current.page + 1,
        reqLimit: paginationModel.current.pageSize,
      });
    }
  }, [props.rows, getList]);

  useEffect(() => {
    if (destroyReq.isSuccess) {
      getList({
        reqPage: paginationModel.current.page + 1,
        reqLimit: paginationModel.current.pageSize,
      });
    }
  }, [destroyReq.isSuccess, getList]);

  useEffect(() => {
    if (destroyReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(destroyReq.error, lRef.current),
        })
      );
    }
  }, [dispatch, destroyReq.error, lRef]);

  useEffect(() => {
    if (getListReq.data) {
      setItems(getListReq.data.rows);
    }
  }, [getListReq.data]);

  useEffect(() => {
    if (getListReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(getListReq.error, lRef.current),
        })
      );
    }
  }, [dispatch, getListReq.error, lRef]);

  useEffect(() => {
    if (getListReq.data?.rows) {
      setItems(getListReq.data?.rows);
    }
  }, [getListReq.data]);

  useEffect(() => {
    if (getListReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(getListReq.error, lRef.current),
        })
      );
    }
  }, [dispatch, getListReq.error, lRef]);

  return (
    <>
      <FormButton
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        href={ROUTES.ui.newRole}
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
      <RolesTable
        initialState={{
          pagination: {
            paginationModel: paginationModel.current,
          },
        }}
        rows={items}
        rowCount={count}
        loading={getListReq.isLoading || destroyReq.isLoading}
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel.ids.values().toArray() as string[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default RolesList;
