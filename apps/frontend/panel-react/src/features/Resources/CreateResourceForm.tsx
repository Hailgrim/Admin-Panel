import { FC, FormEvent, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import resourcesApi from '@/shared/api/resources/resourcesApi';
import { addAlert } from '@/shared/store/main/main';
import useTranslate from '@/shared/hooks/useTranslate';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import { TCreateResource } from '@ap/shared/src/types';
import { getErrorText, ROUTES } from '@ap/shared/src/libs';

const CreateResourceForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [create, createReq] = resourcesApi.useCreateMutation();
  const [data, setData] = useState<TCreateResource>({
    name: '',
    path: '',
    description: '',
    enabled: false,
  });
  const rights = useRights(ROUTES.api.resources);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create(data);
  };

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
      router.push(ROUTES.ui.resource(createReq.data.id));
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
        name="name"
        label={t.name}
        value={data.name}
        onChange={(event) => setData({ ...data, name: event.target.value })}
      />
      <FormField
        required
        name="path"
        label={t.path}
        value={data.path}
        onChange={(event) => setData({ ...data, path: event.target.value })}
      />
      <FormField
        name="description"
        label={t.description}
        value={data.description}
        onChange={(event) =>
          setData({ ...data, description: event.target.value })
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
export default CreateResourceForm;
