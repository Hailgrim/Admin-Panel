import React from 'react';
import { useRouter } from 'next/router';

import lang from '../../../libs/lang';
import rolesApi from '../../../store/api/rolesApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { isAllowed, makeErrorText } from '../../../libs/functions';
import { Rights, ROUTES } from '../../../libs/constants';

const CreateRole: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [create, createReq] = rolesApi.useCreateMutation();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const createHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create({ name, description: description || null });
  };

  React.useEffect(() => {
    if (createReq.isLoading) {
      return;
    }
    if (createReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(createReq.error, userLang) }));
    }
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: lang.get(userLang)?.success }));
      router.push(ROUTES.panel.getRoleRoute(createReq.data.id));
    }
  }, [
    createReq.data, createReq.error, createReq.isLoading,
    dispatch, userLang, router,
  ]);

  return (
    <FormBoxStyled onSubmit={createHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={lang.get(userLang)?.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <TextFieldStyled
        name="description"
        type="text"
        label={lang.get(userLang)?.description}
        value={description}
        onChange={event => setDescription(event.currentTarget.value)}
      />
      <FormActions
        create={{
          loading: createReq.isLoading || Boolean(createReq.data),
          disabled: !isAllowed(ROUTES.panel.roles, Rights.Creating, profile?.roles),
        }}
      />
    </FormBoxStyled>
  );
};
export default CreateRole;
