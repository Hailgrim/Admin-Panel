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
import rolesApi from '@/store/api/rolesApi';

const CreateRoleForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [create, createReq] = rolesApi.useCreateMutation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const rights = useRights(ROUTES.api.roles);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create({ name, description: description || null, enabled });
  };

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      router.push(ROUTES.panel.role(createReq.data.id));
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
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <FormField
        name="description"
        type="text"
        label={t.description}
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
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
export default CreateRoleForm;
