'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import { useAppDispatch } from '@/shared/store/hooks';
import { makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import useLang from '@/shared/hooks/useLang';

const ResourcesList: FC<IList<IResource>> = (props) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const rights = useRights(ROUTES.api.resources);
  const [findAll, findAllReq] = resourcesApi.useLazyFindAllQuery();
  const [findAndCountAll, findAndCountAllReq] =
    resourcesApi.useLazyFindAndCountAllQuery();
  const [destroy, destroyReq] = resourcesApi.useDeleteMutation();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
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
        rowCount={count}
        loading={
          findAllReq.isLoading ||
          findAndCountAllReq.isLoading ||
          destroyReq.isLoading
        }
        onRowSelectionModelChange={(rowSelectionModel) =>
          setSelectedRows(rowSelectionModel as number[])
        }
        onPaginationModelChange={paginationHandler}
      />
    </>
  );
};
export default ResourcesList;
