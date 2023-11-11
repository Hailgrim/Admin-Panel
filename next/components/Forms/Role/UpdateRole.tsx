import React from 'react';
import { useRouter } from 'next/router';

import lang from '../../../lib/lang';
import rolesApi from '../../../store/api/rolesApi';
import { getUpdatedValues, makeErrorText } from '../../../lib/functions';
import { IRole } from '../../../lib/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import FormBoxStyled from '../FormBoxStyled';
import TextFieldStyled from '../../Other/TextFieldStyled';
import { ROUTES } from '../../../lib/constants';
import FormCheckbox from '../FormCheckbox';
import useRights from '../../../hooks/useRights';

const UpdateRole: React.FC<{
  data: IRole;
}> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const [update, updateReq] = rolesApi.useUpdateMutation();
  const [destroy, deleteReq] = rolesApi.useDeleteMutation();
  const [name, setName] = React.useState(data.name);
  const [description, setDescription] = React.useState(data.description || '');
  const [enabled, setEnabled] = React.useState(data.enabled);
  const rights = useRights(ROUTES.api.roles);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedValues = getUpdatedValues<IRole>(
      data,
      { name, description, enabled },
    );
    if (Object.keys(updatedValues).length == 0) {
      dispatch(addAlert({ type: 'warning', text: lang.get(userLang)?.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  React.useEffect(() => {
    if (updateReq.isLoading) {
      return;
    }
    if (updateReq.data === false || updateReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(updateReq.error, userLang) }));
    }
    if (updateReq.data) {
      dispatch(addAlert({ type: 'success', text: lang.get(userLang)?.success }));
    }
  }, [
    updateReq.data, updateReq.error, updateReq.isLoading,
    dispatch, userLang,
  ]);

  React.useEffect(() => {
    if (deleteReq.isLoading) {
      return;
    }
    if (deleteReq.data === false || deleteReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(deleteReq.error, userLang) }));
    }
    if (deleteReq.data) {
      dispatch(addAlert({ type: 'success', text: lang.get(userLang)?.success }));
      router.push(ROUTES.panel.roles);
    }
  }, [
    deleteReq.data, deleteReq.error, deleteReq.isLoading,
    dispatch, userLang, router,
  ]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={lang.get(userLang)?.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
        disabled={data?.default}
      />
      <TextFieldStyled
        name="description"
        type="text"
        label={lang.get(userLang)?.description}
        value={description}
        onChange={event => setDescription(event.currentTarget.value)}
        disabled={data?.default}
      />
      <FormCheckbox
        label={lang.get(userLang)?.enabled}
        name="enabled"
        value="enabled"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      {data && !data.default && (
        <FormActions
          update={{
            loading: updateReq.isLoading,
            disabled: !rights.updating,
          }}
          destroy={{
            action: () => destroy(data.id),
            loading: deleteReq.isLoading,
            disabled: !rights.deleting,
          }}
        />
      )}
    </FormBoxStyled>
  );
};
export default UpdateRole;
