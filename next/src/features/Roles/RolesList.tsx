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
import { IRole } from '@/shared/api/roles/types';
import RolesTable from '@/entities/Roles/RolesTable';
import rolesApi from '@/shared/api/roles/rolesApi';
import { useAppDispatch } from '@/shared/store/hooks';
import useLang from '@/shared/hooks/useLang';
import { makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';

const RolesList: FC<IList<IRole>> = (props) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const rights = useRights(ROUTES.api.roles);
  const [findAll, findAllReq] = rolesApi.useLazyFindAllQuery();
  const [findAndCountAll, findAndCountAllReq] =
    rolesApi.useLazyFindAndCountAllQuery();
  const [destroy, destroyReq] = rolesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [items, setItems] = useState(props.rows);
  const paginationModel = useRef<GridPaginationModel>({
    page: (props.page || 1) - 1,
    pageSize: props.quantity || 25,
  });
  const count = useMemo(
    () =>
      findAndCountAllReq.data?.count ||
      props.count ||
      paginationModel.current.page * paginationModel.current.pageSize,
    [props.count, findAndCountAllReq.data]
  );

  const paginationHandler = (model: GridPaginationModel) => {
    findAll({ page: model.page + 1, quantity: model.pageSize });
    paginationModel.current = model;
    props.onPageUpdate?.(model.page + 1);
    props.onQuantityUpdate?.(model.pageSize);
  };

  useEffect(() => {
    if (!props.rows) {
      findAndCountAll({
        page: paginationModel.current.page + 1,
        quantity: paginationModel.current.pageSize,
      });
    }
  }, [props.rows, findAndCountAll]);

  useEffect(() => {
    if (destroyReq.data) {
      findAndCountAll({
        page: paginationModel.current.page + 1,
        quantity: paginationModel.current.pageSize,
      });
    }
  }, [destroyReq.data, findAndCountAll]);

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
      setItems(findAllReq.data);
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
    if (findAndCountAllReq.data?.rows) {
      setItems(findAndCountAllReq.data?.rows);
    }
  }, [findAndCountAllReq.data]);

  useEffect(() => {
    if (findAndCountAllReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(findAndCountAllReq.error, lang.current),
        })
      );
    }
  }, [dispatch, findAndCountAllReq.error, lang]);

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
        onClick={() => destroy(selectedRows)}
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
        loading={
          findAllReq.isLoading ||
          findAndCountAllReq.isLoading ||
          destroyReq.isLoading
        }
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel as string[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default RolesList;
