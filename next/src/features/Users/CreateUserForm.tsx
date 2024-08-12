import { FC, FormEvent, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import FormPassword from '@/shared/ui/Form/FormPassword';
import usersApi from '@/shared/api/users/usersApi';
import { useAppDispatch } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import { makeErrorText } from '@/shared/lib/utils';
import { IUserCreate } from '@/shared/api/users/types';

const CreateUserForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [create, createReq] = usersApi.useCreateMutation();
  const [data, setData] = useState<IUserCreate>({
    email: '',
    name: '',
    password: '',
    enabled: false,
  });
  const rights = useRights(ROUTES.api.users);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create(data);
  };

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      router.push(ROUTES.ui.user(createReq.data.id));
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
    <Form onSubmit={submitHandler}>
      <FormField
        required
        name="email"
        type="email"
        label={t.email}
        value={data.email}
        onChange={(event) =>
          setData({ ...data, email: event.currentTarget.value })
        }
      />
      <FormField
        required
        name="name"
        label={t.name}
        value={data.name}
        onChange={(event) =>
          setData({ ...data, name: event.currentTarget.value })
        }
      />
      <FormPassword
        required
        autoComplete="new-password"
        name="password"
        label={t.password}
        value={data.password}
        onChange={(event) =>
          setData({ ...data, password: event.currentTarget.value })
        }
      />
      <FormCheckbox
        labelProps={{ label: t.enabled }}
        name="enabled"
        value="enabled"
        checked={data.enabled}
        onChange={() => setData({ ...data, enabled: !data.enabled })}
      />
      <FormButton
        type="submit"
        color="primary"
        startIcon={<AddIcon />}
        disabled={!rights.creating}
        loading={createReq.isLoading || Boolean(createReq.data)}
      >
        {t.create}
      </FormButton>
    </Form>
  );
};
export default CreateUserForm;
