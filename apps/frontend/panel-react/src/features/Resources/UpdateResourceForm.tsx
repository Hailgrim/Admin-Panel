import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { addAlert } from '@/shared/store/main/main';
import useTranslate from '@/shared/hooks/useTranslate';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import { IResource } from '@ap/shared/src/types';
import { getErrorText, getUpdatedValues, ROUTES } from '@ap/shared/src/libs';

const UpdateResourceForm: FC<{ data: IResource }> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, updateReq] = resourcesApi.useUpdateMutation();
  const [destroy, deleteReq] = resourcesApi.useDeleteMutation();
  const [oldData, setOldData] = useState<IResource>(data);
  const [newData, setNewData] = useState<IResource>(data);
  const rights = useRights(ROUTES.api.resources);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedValues = getUpdatedValues<IResource>(oldData, newData);

    if (Object.keys(updatedValues).length === 0) {
      dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  useEffect(() => {
    if (updateReq.isSuccess) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
      setOldData((prev) => ({ ...prev, ...updateReq.originalArgs?.fields }));
    }
  }, [updateReq.isSuccess, updateReq.originalArgs, dispatch, tRef]);

  useEffect(() => {
    if (updateReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(updateReq.error, lRef.current),
        })
      );
    }
  }, [updateReq.error, dispatch, lRef]);

  useEffect(() => {
    if (deleteReq.isSuccess) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
      router.push(ROUTES.ui.resources);
    }
  }, [deleteReq.isSuccess, dispatch, router, tRef]);

  useEffect(() => {
    if (deleteReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(deleteReq.error, lRef.current),
        })
      );
    }
  }, [deleteReq.error, dispatch, lRef]);

  return (
    <FormBase onSubmit={submitHandler}>
      <FormField
        required
        name="name"
        label={t.name}
        value={newData.name}
        onChange={(event) =>
          setNewData({ ...newData, name: event.target.value })
        }
      />
      <FormField
        required
        name="path"
        label={t.path}
        value={newData.path}
        onChange={(event) =>
          setNewData({ ...newData, path: event.target.value })
        }
      />
      <FormField
        name="description"
        label={t.description}
        value={newData.description || ''}
        onChange={(event) =>
          setNewData({
            ...newData,
            description: event.target.value,
          })
        }
      />
      <FormCheckbox
        labelProps={{ label: t.enabled }}
        name="enabled"
        value="enabled"
        checked={newData.enabled}
        onChange={() => setNewData({ ...newData, enabled: !newData.enabled })}
      />
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={
          !rights.updating ||
          data.default ||
          deleteReq.isLoading ||
          deleteReq.isSuccess
        }
        loading={updateReq.isLoading}
      >
        {t.update}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => destroy({ items: [data.id] })}
        disabled={
          !rights.deleting ||
          deleteReq.isLoading ||
          deleteReq.isSuccess ||
          data.default
        }
      >
        {t.delete}
      </FormButton>
    </FormBase>
  );
};
export default UpdateResourceForm;
