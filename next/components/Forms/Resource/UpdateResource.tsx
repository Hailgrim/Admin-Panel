import React from 'react';
import { useRouter } from 'next/router';

import resourcesApi from '../../../store/api/resourcesApi';
import { getUpdatedValues, makeErrorText } from '../../../lib/functions';
import { IResource } from '../../../lib/types';
import { useAppDispatch } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../FormTextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../lib/constants';
import FormCheckbox from '../FormCheckbox';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';
import useT from 'hooks/useT';

const UpdateResource: React.FC<{
  data: IResource;
}> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = resourcesApi.useUpdateMutation();
  const [destroy, deleteReq] = resourcesApi.useDeleteMutation();
  const [name, setName] = React.useState(data.name);
  const [path, setPath] = React.useState(data.path);
  const [description, setDescription] = React.useState(data.description || '');
  const [enabled, setEnabled] = React.useState(Boolean(data.enabled));
  const rights = useRights(ROUTES.api.resources);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedValues = getUpdatedValues<IResource>(data, {
      name,
      path,
      description: description || null,
    });
    if (Object.keys(updatedValues).length == 0) {
      dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  React.useEffect(() => {
    if (updateReq.isLoading) {
      return;
    }
    if (updateReq.data === false || updateReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(updateReq.error, lang.current),
        })
      );
    }
    if (updateReq.data) {
      dispatch(
        addAlert({ type: 'success', text: dictionary[lang.current].success })
      );
    }
  }, [updateReq.data, updateReq.error, updateReq.isLoading, dispatch, lang]);

  React.useEffect(() => {
    if (deleteReq.isLoading) {
      return;
    }
    if (deleteReq.data === false || deleteReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(deleteReq.error, lang.current),
        })
      );
    }
    if (deleteReq.data) {
      dispatch(
        addAlert({ type: 'success', text: dictionary[lang.current].success })
      );
      router.push(ROUTES.panel.users);
    }
  }, [
    deleteReq.data,
    deleteReq.error,
    deleteReq.isLoading,
    dispatch,
    router,
    lang,
  ]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        disabled={data?.default}
      />
      <TextFieldStyled
        required
        name="path"
        type="text"
        label={t.path}
        value={path}
        onChange={(event) => setPath(event.currentTarget.value)}
        disabled={data?.default}
      />
      <TextFieldStyled
        name="description"
        type="text"
        label={t.description}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        disabled={data?.default}
      />
      <FormCheckbox
        label={t.enabled}
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
export default UpdateResource;
