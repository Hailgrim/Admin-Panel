import React from 'react';
import { useRouter } from 'next/router';

import lang from '../../../libs/lang';
import usersApi from '../../../store/api/usersApi';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import FormCheckbox from '../FormCheckbox';
import { isAllowed, makeErrorText } from '../../../libs/functions';
import { Rights, ROUTES } from '../../../libs/constants';

const CreateUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [create, createReq] = usersApi.useCreateMutation();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [enabled, setEnabled] = React.useState(false);
  const [password, setPassword] = React.useState('');

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
      router.push(ROUTES.panel.getUserRoute(createReq.data.id));
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
        onChange={event => setEnabled(event.currentTarget.checked)}
      />
      <FormActions
        create={{
          loading: createReq.isLoading || Boolean(createReq.data),
          disabled: !isAllowed(ROUTES.panel.users, Rights.Creating, profile?.roles),
        }}
      />
    </FormBoxStyled>
  );
};
export default CreateUser;
