import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import usersApi from '@/shared/api/users/usersApi';
import { getUpdatedValues, makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import { IUser } from '@/shared/api/users/types';

const UpdateUserForm: FC<{ data: IUser }> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = usersApi.useUpdateMutation();
  const [destroy, deleteReq] = usersApi.useDeleteMutation();
  const [oldData, setOldData] = useState<IUser>(data);
  const [newData, setNewData] = useState<IUser>(data);
  const rights = useRights(ROUTES.api.users);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedValues = getUpdatedValues<Partial<IUser>>(oldData, newData);

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
      router.push(ROUTES.ui.users);
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
    <Form onSubmit={submitHandler}>
      <FormField
        required
        name="email"
        type="email"
        label={t.email}
        value={newData.email}
        onChange={(event) =>
          setNewData({ ...newData, email: event.currentTarget.value })
        }
      />
      <FormField
        required
        name="name"
        label={t.name}
        value={newData.name}
        onChange={(event) =>
          setNewData({ ...newData, name: event.currentTarget.value })
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
        disabled={!rights.updating || deleteReq.isLoading || deleteReq.data}
        loading={updateReq.isLoading}
      >
        {t.update}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => destroy([data.id])}
        disabled={!rights.deleting || data.roles?.some((role) => role.admin)}
        loading={deleteReq.isLoading || deleteReq.data}
      >
        {t.delete}
      </FormButton>
    </Form>
  );
};
export default UpdateUserForm;
