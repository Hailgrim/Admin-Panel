import React from 'react';
import { useRouter } from 'next/router';

import resourcesApi from '../../../store/api/resourcesApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { makeErrorText } from '../../../lib/functions';
import { ROUTES } from '../../../lib/constants';
import FormCheckbox from '../FormCheckbox';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';

const CreateResource: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useAppSelector(store => store.app.t);
  const [create, createReq] = resourcesApi.useCreateMutation();
  const [name, setName] = React.useState('');
  const [path, setPath] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [enabled, setEnabled] = React.useState(true);
  const rights = useRights(ROUTES.api.resources);

  const createHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create({ name, path, description: description || null, enabled });
  };

  React.useEffect(() => {
    if (createReq.isLoading) {
      return;
    }
    if (createReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(createReq.error, lang.current) }));
    }
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: dictionary[lang.current].success }));
      router.push(ROUTES.panel.resource(createReq.data.id));
    }
  }, [createReq.data, createReq.error, createReq.isLoading, dispatch, router]);

  return (
    <FormBoxStyled onSubmit={createHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <TextFieldStyled
        required
        name="path"
        type="text"
        label={t.path}
        value={path}
        onChange={event => setPath(event.currentTarget.value)}
      />
      <TextFieldStyled
        name="description"
        type="text"
        label={t.description}
        value={description}
        onChange={event => setDescription(event.currentTarget.value)}
      />
      <FormCheckbox
        label={t.enabled}
        name="enabled"
        value="enabled"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <FormActions
        create={{
          loading: createReq.isLoading || Boolean(createReq.data),
          disabled: !rights.creating,
        }}
      />
    </FormBoxStyled>
  );
};
export default CreateResource;
