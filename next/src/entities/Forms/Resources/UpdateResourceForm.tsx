import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import Form from '@/shared/kit/Form/Form';
import FormField from '@/shared/kit/Form/FormField';
import FormButton from '@/shared/kit/Form/FormButton';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/kit/Form/FormCheckbox';
import { IResource } from '@/shared/api/resources/types';
import { useAppDispatch } from '@/shared/store/hooks';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { getUpdatedValues, makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';

const UpdateResourceForm: FC<{ data: IResource }> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = resourcesApi.useUpdateMutation();
  const [destroy, deleteReq] = resourcesApi.useDeleteMutation();
  const [oldData, setOldData] = useState<IResource>(data);
  const [newData, setNewData] = useState<IResource>(data);
  const rights = useRights(ROUTES.api.resources);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedValues = getUpdatedValues<IResource>(oldData, newData);

    if (Object.keys(updatedValues).length == 0) {
      dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  useEffect(() => {
    if (updateReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      setOldData((prev) => ({ ...prev, ...updateReq.originalArgs?.fields }));
    }
  }, [updateReq.data, updateReq.originalArgs, dispatch, lang]);

  useEffect(() => {
    if (updateReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(updateReq.error, lang.current),
        })
      );
    }
  }, [updateReq.error, dispatch, lang]);

  useEffect(() => {
    if (deleteReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      router.push(ROUTES.panel.resources);
    }
  }, [deleteReq.data, dispatch, router, lang]);

  useEffect(() => {
    if (deleteReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(deleteReq.error, lang.current),
        })
      );
    }
  }, [deleteReq.error, dispatch, lang]);

  return (
    <Form onSubmit={formHandler}>
      <FormField
        required
        name="name"
        type="text"
        label={t.name}
        value={newData.name}
        onChange={(event) =>
          setNewData({ ...newData, name: event.currentTarget.value })
        }
      />
      <FormField
        required
        name="path"
        type="text"
        label={t.path}
        value={newData.path}
        onChange={(event) =>
          setNewData({ ...newData, path: event.currentTarget.value })
        }
      />
      <FormField
        name="description"
        type="text"
        label={t.description}
        value={newData.description || ''}
        onChange={(event) =>
          setNewData({
            ...newData,
            description: event.currentTarget.value,
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
          deleteReq.data
        }
        loading={updateReq.isLoading}
      >
        {t.update}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => destroy(data.id)}
        disabled={
          !rights.deleting ||
          deleteReq.isLoading ||
          deleteReq.data ||
          data.default
        }
      >
        {t.delete}
      </FormButton>
    </Form>
  );
};
export default UpdateResourceForm;
