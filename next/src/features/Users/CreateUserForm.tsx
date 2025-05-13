import { FC, FormEvent, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import FormPassword from '@/shared/ui/Form/FormPassword';
import usersApi from '@/shared/api/users/usersApi';
import { useAppDispatch } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import { d, getErrorText, ROUTES, TCreateUser } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslateRef from '@/shared/hooks/useTranslateRef';

const CreateUserForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tRef = useTranslateRef();
  const lRef = useLanguageRef();
  const t = useTranslate();
  const [create, createReq] = usersApi.useCreateMutation();
  const [data, setData] = useState<TCreateUser>({
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
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
      router.push(ROUTES.ui.user(createReq.data.id));
    }
  }, [createReq.data, dispatch, router, tRef]);

  useEffect(() => {
    if (createReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(createReq.error, lRef.current),
        })
      );
    }
  }, [createReq.error, dispatch, lRef]);

  return (
    <FormBase onSubmit={submitHandler}>
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
    </FormBase>
  );
};
export default CreateUserForm;
