import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import Form from '@/components/Form/Form';
import FormField from '@/components/Form/FormField';
import FormButton from '@/components/Form/FormButton';
import { ROUTES } from '@/lib/constants';
import useT from '@/hooks/useT';
import { getUpdatedValues, makeErrorText } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import { addAlert } from '@/store/slices/appSlice';
import { useAppDispatch } from '@/store/hooks';
import d from '@/locales/dictionary';
import useRights from '@/hooks/useRights';
import { IRole } from '@/lib/types';
import FormCheckbox from '@/components/Form/FormCheckbox';
import rolesApi from '@/store/api/rolesApi';

const UpdateRoleForm: FC<{ data: IRole }> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = rolesApi.useUpdateMutation();
  const [destroy, deleteReq] = rolesApi.useDeleteMutation();
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description || '');
  const [enabled, setEnabled] = useState(data.enabled);
  const rights = useRights(ROUTES.api.roles);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedValues = getUpdatedValues<IRole>(data, {
      name,
      description,
      enabled,
    });

    if (Object.keys(updatedValues).length == 0) {
      dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  useEffect(() => {
    if (updateReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
    }
  }, [updateReq.data, dispatch, lang]);

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
      router.push(ROUTES.panel.roles);
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
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <FormField
        name="description"
        type="text"
        label={t.description}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <FormCheckbox
        labelProps={{ label: t.enabled }}
        name="enabled"
        value="enabled"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={
          !rights.updating || updateReq.isLoading || data.default || data.admin
        }
      >
        {t.update}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => destroy(data.id)}
        disabled={
          !rights.deleting || deleteReq.isLoading || data.default || data.admin
        }
      >
        {t.delete}
      </FormButton>
    </Form>
  );
};
export default UpdateRoleForm;
