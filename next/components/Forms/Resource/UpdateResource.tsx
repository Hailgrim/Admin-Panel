import React from 'react';
import { useRouter } from 'next/router';

import lang from '../../../libs/lang';
import resourcesApi from '../../../store/api/resourcesApi';
import { getUpdatedValues, isAllowed, makeErrorText } from '../../../libs/functions';
import { IResource } from '../../../libs/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { Rights, ROUTES } from '../../../libs/constants';

const UpdateResource: React.FC<{
  data: IResource;
}> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [update, updateReq] = resourcesApi.useUpdateMutation();
  const [destroy, deleteReq] = resourcesApi.useDeleteMutation();
  const [name, setName] = React.useState(data.name);
  const [path, setPath] = React.useState(data.path);
  const [description, setDescription] = React.useState(data.description || '');

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedValues = getUpdatedValues<IResource>(
      data,
      { name, path, description: description || null },
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
      router.push(ROUTES.panel.users);
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
        required
        name="path"
        type="text"
        label={lang.get(userLang)?.path}
        value={path}
        onChange={event => setPath(event.currentTarget.value)}
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
      {data && !data.default && (
        <FormActions
          update={{
            loading: updateReq.isLoading,
            disabled: !isAllowed(ROUTES.panel.resources, Rights.Updating, profile?.roles),
          }}
          destroy={{
            action: () => destroy(data.id),
            loading: deleteReq.isLoading,
            disabled: !isAllowed(ROUTES.panel.resources, Rights.Deleting, profile?.roles),
          }}
        />
      )}
    </FormBoxStyled>
  );
};
export default UpdateResource;
