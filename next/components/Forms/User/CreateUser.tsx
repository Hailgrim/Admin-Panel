import React from 'react';
import { useRouter } from 'next/router';

import lang from '../../../lib/lang';
import usersApi from '../../../store/api/usersApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import FormCheckbox from '../FormCheckbox';
import { makeErrorText } from '../../../lib/functions';
import { ROUTES } from '../../../lib/constants';
import useRights from '../../../hooks/useRights';

const CreateUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const [create, createReq] = usersApi.useCreateMutation();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [enabled, setEnabled] = React.useState(true);
  const rights = useRights(ROUTES.api.users);

  const createHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create({ email, name, password, enabled });
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
      router.push(ROUTES.panel.user(createReq.data.id));
    }
  }, [
    createReq.data, createReq.error, createReq.isLoading,
    dispatch, userLang, router,
  ]);

  return (
    <FormBoxStyled
      autoComplete="off"
      onSubmit={createHandler}
    >
      <TextFieldStyled
        required
        autoComplete="off"
        name="email"
        type="email"
        label={lang.get(userLang)?.email}
        value={email}
        onChange={event => setEmail(event.currentTarget.value)}
      />
      <TextFieldStyled
        required
        autoComplete="off"
        name="name"
        type="text"
        label={lang.get(userLang)?.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <TextFieldStyled
        required
        autoComplete="new-password"
        name="password"
        type="password"
        label={lang.get(userLang)?.password}
        value={password}
        onChange={event => setPassword(event.currentTarget.value)}
      />
      <FormCheckbox
        label={lang.get(userLang)?.enabled}
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
export default CreateUser;
