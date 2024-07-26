import { FC, FormEvent, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import Form from '@/shared/kit/Form/Form';
import FormField from '@/shared/kit/Form/FormField';
import FormButton from '@/shared/kit/Form/FormButton';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/kit/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { makeErrorText } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import { IResourceCreate } from '@/shared/api/resources/types';

const CreateResourceForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [create, createReq] = resourcesApi.useCreateMutation();
  const [data, setData] = useState<IResourceCreate>({
    name: '',
    path: '',
    description: '',
    enabled: false,
  });
  const rights = useRights(ROUTES.api.resources);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create(data);
  };

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
      router.push(ROUTES.panel.resource(createReq.data.id));
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
        value={data.name}
        onChange={(event) =>
          setData({ ...data, name: event.currentTarget.value })
        }
      />
      <FormField
        required
        name="path"
        type="text"
        label={t.path}
        value={data.path}
        onChange={(event) =>
          setData({ ...data, path: event.currentTarget.value })
        }
      />
      <FormField
        name="description"
        type="text"
        label={t.description}
        value={data.description}
        onChange={(event) =>
          setData({ ...data, description: event.currentTarget.value || null })
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
        loading={createReq.isLoading || !!createReq.data}
      >
        {t.create}
      </FormButton>
    </Form>
  );
};
export default CreateResourceForm;
