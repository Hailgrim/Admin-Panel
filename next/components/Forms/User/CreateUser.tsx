import React from 'react';
import { useRouter } from 'next/router';

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
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';

const CreateUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useAppSelector(store => store.app.t);
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
      dispatch(addAlert({ type: 'error', text: makeErrorText(createReq.error, lang.current) }));
    }
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: dictionary[lang.current].success }));
      router.push(ROUTES.panel.user(createReq.data.id));
    }
  }, [createReq.data, createReq.error, createReq.isLoading, dispatch, router]);

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
        label={t.email}
        value={email}
        onChange={event => setEmail(event.currentTarget.value)}
      />
      <TextFieldStyled
        required
        autoComplete="off"
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <TextFieldStyled
        required
        autoComplete="new-password"
        name="password"
        type="password"
        label={t.password}
        value={password}
        onChange={event => setPassword(event.currentTarget.value)}
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
export default CreateUser;
