import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import usersApi from '@/shared/api/users/usersApi';
import { addAlert } from '@/shared/store/main/main';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import { IUser } from '@ap/shared/src/types';
import { EMAIL_REGEX, getErrorText, getUpdatedValues, NAME_REGEX, ROUTES, testString } from '@ap/shared/src/libs';

const UpdateUserForm: FC<{ data: IUser }> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, updateReq] = usersApi.useUpdateMutation();
  const [destroy, deleteReq] = usersApi.useDeleteMutation();
  const [oldData, setOldData] = useState<IUser>(data);
  const [newData, setNewData] = useState<IUser>(data);
  const rights = useRights(ROUTES.api.users);
  const emailIsValid = useMemo(
    () => newData.name && testString(EMAIL_REGEX, newData.email || ''),
    [newData]
  );
  const nameIsValid = useMemo(
    () => newData.name && testString(NAME_REGEX, newData.name),
    [newData]
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedValues = getUpdatedValues<Partial<IUser>>(oldData, newData);

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
      router.push(ROUTES.ui.users);
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
        name="email"
        type="email"
        label={t.email}
        value={newData.email || ''}
        onChange={(event) =>
          setNewData({ ...newData, email: event.target.value })
        }
        helperText={t.emailValidation}
        color={emailIsValid ? 'success' : 'error'}
        error={!emailIsValid && (newData.email || '').length > 0}
      />
      <FormField
        required
        name="name"
        label={t.name}
        value={newData.name}
        onChange={(event) =>
          setNewData({ ...newData, name: event.target.value })
        }
        helperText={t.nameValidation}
        color={nameIsValid ? 'success' : 'error'}
        error={!nameIsValid && newData.name.length > 0}
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
          !rights.updating || deleteReq.isLoading || deleteReq.isSuccess
        }
        loading={updateReq.isLoading}
      >
        {t.update}
      </FormButton>
      <FormButton
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => destroy({ items: [data.id] })}
        disabled={!rights.deleting || data.roles?.some((role) => role.admin)}
        loading={deleteReq.isLoading || deleteReq.isSuccess}
      >
        {t.delete}
      </FormButton>
    </FormBase>
  );
};
export default UpdateUserForm;
