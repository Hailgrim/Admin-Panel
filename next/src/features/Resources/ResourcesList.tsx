'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridPaginationModel } from '@mui/x-data-grid/models';

import ResourcesTable from '@/entities/Resources/ResourcesTable';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { IList } from '@/shared/lib/types';
import { useAppDispatch } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import { getErrorText, IResource, ROUTES } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const ResourcesList: FC<IList<IResource>> = (props) => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const t = useTranslate();
  const rights = useRights(ROUTES.api.resources);
  const [getList, getListReq] = resourcesApi.useLazyGetListQuery();
  const [destroy, destroyReq] = resourcesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [items, setItems] = useState(props.rows);
  const paginationModel = useRef<GridPaginationModel>({
    page: (props.page || 1) - 1,
    pageSize: props.quantity || 25,
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
    paginationModel.current = model;
    props.onPageUpdate?.(model.page + 1);
    props.onQuantityUpdate?.(model.pageSize);
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
        onClick={() => destroy({ items: selectedRows })}
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
        rowCount={count}
        loading={getListReq.isLoading || destroyReq.isLoading}
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel as string[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default ResourcesList;
