import { FC, FormEvent, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import Form from '@/components/Form/Form';
import FormField from '@/components/Form/FormField';
import FormButton from '@/components/Form/FormButton';
import { ROUTES } from '@/lib/constants';
import useT from '@/hooks/useT';
import { makeErrorText } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import { addAlert } from '@/store/slices/appSlice';
import { useAppDispatch } from '@/store/hooks';
import d from '@/locales/dictionary';
import useRights from '@/hooks/useRights';
import FormCheckbox from '@/components/Form/FormCheckbox';
import usersApi from '@/store/api/usersApi';
import FormPassword from '@/components/Form/FormPassword';

const CreateUserForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [create, createReq] = usersApi.useCreateMutation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [enabled, setEnabled] = useState(true);
  const rights = useRights(ROUTES.api.users);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create({ email, name, password, enabled });
  };

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      router.push(ROUTES.panel.user(createReq.data.id));
    }
  }, [createReq.data, dispatch, router, lang]);

  useEffect(() => {
    if (createReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(createReq.error, lang.current),
        })
      );
    }
  }, [createReq.error, dispatch, lang]);

  return (
    <Form onSubmit={formHandler}>
      <FormField
        required
        name="email"
        type="email"
        label={t.email}
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
      />
      <FormField
        required
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <FormPassword
        required
        autoComplete="new-password"
        name="password"
        label={t.password}
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <FormCheckbox
        labelProps={{ label: t.enabled }}
        name="enabled"
        value="enabled"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <FormButton
        type="submit"
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating || createReq.isLoading}
      >
        {t.create}
      </FormButton>
    </Form>
  );
};
export default CreateUserForm;
