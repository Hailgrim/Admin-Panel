import React from 'react';
import { useRouter } from 'next/router';

import rolesApi from '../../../store/api/rolesApi';
import { useAppDispatch } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../FormTextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { makeErrorText } from '../../../lib/functions';
import { ROUTES } from '../../../lib/constants';
import FormCheckbox from '../FormCheckbox';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';
import useT from 'hooks/useT';

const CreateRole: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [create, createReq] = rolesApi.useCreateMutation();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [enabled, setEnabled] = React.useState(true);
  const rights = useRights(ROUTES.api.roles);

  const createHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create({ name, description: description || null, enabled });
  };

  React.useEffect(() => {
    if (createReq.isLoading) {
      return;
    }
    if (createReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(createReq.error, lang.current),
        })
      );
    }
    if (createReq.data) {
      dispatch(
        addAlert({ type: 'success', text: dictionary[lang.current].success })
      );
      router.push(ROUTES.panel.role(createReq.data.id));
    }
  }, [
    createReq.data,
    createReq.error,
    createReq.isLoading,
    dispatch,
    router,
    lang,
  ]);

  return (
    <FormBoxStyled onSubmit={createHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <TextFieldStyled
        name="description"
        type="text"
        label={t.description}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
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
export default CreateRole;
