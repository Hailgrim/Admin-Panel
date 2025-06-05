import { FC, FormEvent, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useTranslate from '@/shared/hooks/useTranslate';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import rolesApi from '@/shared/api/roles/rolesApi';
import { useAppDispatch } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import { getErrorText, ROUTES, TCreateRole } from '@ap/shared';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const CreateRoleForm: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [create, createReq] = rolesApi.useCreateMutation();
  const [data, setData] = useState<TCreateRole>({
    name: '',
    description: '',
    enabled: false,
  });
  const rights = useRights(ROUTES.api.roles);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    create(data);
  };

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
      router.push(ROUTES.ui.role(createReq.data.id));
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
        onChange={(event) =>
          setData({ ...data, name: event.currentTarget.value })
        }
      />
      <FormField
        name="description"
        label={t.description}
        value={data.description}
        onChange={(event) =>
          setData({ ...data, description: event.currentTarget.value })
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
export default CreateRoleForm;
